import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name, { timestamp: true });
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async uploadFile(
    fileKey: string,
    fileBuffer: Buffer,
    contentType: string,
    contentDisposition?: string,
  ): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: fileKey,
        Body: fileBuffer,
        ContentType: contentType,
        ContentDisposition: contentDisposition,
      }),
    );
    return `${this.configService.get('AWS_S3_BUCKET_URL')}/${fileKey}`;
  }

  async deleteFile(fileKey: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: fileKey,
      }),
    );
  }

  async generateSignedUrl(
    fileKey: string,
    expireSeconds: number = 60 * 60 * 24 * 7,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: fileKey,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: expireSeconds,
    });
  }

  async getFileBuffer(fileKey: string): Promise<{ buffer: Buffer; contentType: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: fileKey,
      });

      const { Body, ContentType } = await this.s3Client.send(command);
      const stream = Body as Readable;

      if (!(stream instanceof Readable)) {
        throw new UnprocessableEntityException('Expected Body to be a Readable stream');
      }

      const buffer = await this.streamToBuffer(stream);

      return { buffer, contentType: ContentType || 'application/octet-stream' };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  async checkExistingFile(fileKey: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: fileKey,
        }),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getFileStream(fileKey: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: fileKey,
      });

      const { Body } = await this.s3Client.send(command);
      const stream = Body as Readable;

      if (!(stream instanceof Readable)) {
        throw new UnprocessableEntityException('Expected Body to be a Readable stream');
      }

      return stream;
    } catch (error) {
      this.logger.error('Error fetching file stream from S3:', error);
      throw new NotFoundException('File not found');
    }
  }

  private streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  /**
   * Sets a file in S3 to expire after a specified number of seconds.
   */
  async setFileExpiration(fileKey: string, expireSeconds: number): Promise<void> {
    const bucketName = this.configService.get('AWS_S3_BUCKET');

    try {
      // Retrieve the existing file metadata
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
        }),
      );

      // Copy the file to itself with an expiration rule
      await this.s3Client.send(
        new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: `${bucketName}/${fileKey}`,
          Key: fileKey,
          MetadataDirective: 'REPLACE',
          Expires: new Date(Date.now() + expireSeconds * 1000),
        }),
      );
    } catch (error) {
      this.logger.error('Error setting file expiration:', error);
      throw new UnprocessableEntityException('Failed to set file expiration');
    }
  }

  /**
   * Get the URI of a file stored in S3.
   */
  getFileUri(fileKey: string) {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const region = this.configService.get<string>('AWS_REGION');

    if (!bucketName || !region) {
      throw new UnprocessableEntityException('S3 bucket name or region is not configured.');
    }

    // Construct the file URI
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
  }

  async updateContentDisposition(fileKey: string, contentDisposition: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');

    try {
      // Retrieve the existing metadata
      const headObject = await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
        }),
      );

      // Copy the file to itself with updated metadata
      await this.s3Client.send(
        new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: `${bucketName}/${fileKey}`,
          Key: fileKey,
          MetadataDirective: 'REPLACE', // Replace metadata
          ContentDisposition: contentDisposition, // Set the new Content-Disposition
          ContentType: headObject.ContentType, // Preserve the original Content-Type
        }),
      );

      this.logger.log(`Content-Disposition updated for file: ${fileKey}`);
    } catch (error) {
      this.logger.error(`Failed to update Content-Disposition for file: ${fileKey}`, error);
      throw new UnprocessableEntityException('Failed to update Content-Disposition');
    }
  }
}
