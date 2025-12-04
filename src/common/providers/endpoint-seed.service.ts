// seed/endpoint-seed.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EndpointService } from 'src/endpoint/endpoint.service';
import { Endpoint } from 'src/endpoint/entities/endpoint.entity';
import { Role } from 'src/role/entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class EndpointSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EndpointSeedService.name);

  constructor(
    private readonly endpointService: EndpointService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    if (isProduction) {
      this.logger.warn('Skipping endpoint sync in production');
      return;
    }

    this.logger.log('Starting endpoint synchronization...');

    try {
      await this.syncEndpoints();
      this.logger.log('Endpoint synchronization completed successfully');
    } catch (error) {
      this.logger.error('Failed to sync endpoints', error.stack);
    }
  }

  async syncEndpoints() {
    const startTime = Date.now();
    this.logger.log('🔄 Starting endpoint synchronization...');

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const routes = this.endpointService.getAllRoutes();
      const existingEndpoints = await queryRunner.manager.find(Endpoint);

      this.logger.log(`📊 Code has ${routes.length} endpoints`);
      this.logger.log(`📊 Database has ${existingEndpoints.length} endpoints`);

      const newRoutes = routes.filter(
        (route) =>
          !existingEndpoints.some((ep) => ep.url === route.path && ep.method === route.method),
      );

      if (newRoutes.length === 0) {
        this.logger.log('✅ Database is already synchronized');
        await queryRunner.commitTransaction();
        return { added: 0, message: 'No changes needed' };
      }

      this.logger.log(`➕ Found ${newRoutes.length} new endpoints to add:`);
      newRoutes.forEach((route) => {
        this.logger.log(`   • ${route.method.padEnd(7)} ${route.path}`);
      });

      const insertedResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Endpoint)
        .values(newRoutes.map((r) => ({ url: r.path, method: r.method })))
        .returning('*')
        .execute();

      const roles = await queryRunner.manager.find(Role, {
        where: { isActive: true },
      });

      this.logger.log(`👥 Creating permissions for ${roles.length} roles`);

      const permissionsToInsert: { endpointId: number; roleName: string; isAllow: boolean }[] = [];
      for (const role of roles) {
        for (const endpoint of insertedResult.generatedMaps) {
          permissionsToInsert.push({
            endpointId: endpoint.id,
            roleName: role.name,
            isAllow: false,
          });
        }
      }

      if (permissionsToInsert.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(Permission)
          .values(permissionsToInsert)
          .orIgnore()
          .execute();
      }

      await queryRunner.commitTransaction();

      const duration = Date.now() - startTime;

      this.logger.log('✅ Synchronization completed successfully');
      this.logger.log(`📊 Summary:`);
      this.logger.log(`   • Endpoints added: ${newRoutes.length}`);
      this.logger.log(`   • Permissions created: ${permissionsToInsert.length}`);
      this.logger.log(`   • Total endpoints: ${existingEndpoints.length + newRoutes.length}`);
      this.logger.log(`   • Duration: ${duration}ms`);

      return {
        success: true,
        added: newRoutes.length,
        permissionsCreated: permissionsToInsert.length,
        total: existingEndpoints.length + newRoutes.length,
        duration,
        newEndpoints: newRoutes.map((r) => `${r.method} ${r.path}`),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('❌ Synchronization failed', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
