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

      if (newRoutes.length > 0) {
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

        const permissionsToInsert: { endpointId: number; roleName: string; isAllow: boolean }[] =
          [];
        for (const role of roles) {
          for (const endpoint of insertedResult.generatedMaps) {
            const defaultAllow = this.getDefaultPermission(
              role.name,
              endpoint.url,
              endpoint.method,
            );

            permissionsToInsert.push({
              endpointId: endpoint.id,
              roleName: role.name,
              isAllow: defaultAllow,
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

        this.logger.log(`✅ Added ${newRoutes.length} endpoints`);
        this.logger.log(`✅ Created ${permissionsToInsert.length} permissions`);
      }

      const allEndpoints = await queryRunner.manager.find(Endpoint);
      const allRoles = await queryRunner.manager.find(Role, {
        where: { isActive: true },
      });

      this.logger.log('🔍 Checking for missing permissions...');

      let missingPermissionsCount = 0;
      for (const role of allRoles) {
        for (const endpoint of allEndpoints) {
          const existingPermission = await queryRunner.manager.findOne(Permission, {
            where: {
              roleName: role.name,
              endpointId: endpoint.id,
            },
          });

          if (!existingPermission) {
            const defaultAllow = this.getDefaultPermission(
              role.name,
              endpoint.url,
              endpoint.method,
            );

            await queryRunner.manager
              .createQueryBuilder()
              .insert()
              .into(Permission)
              .values({
                endpointId: endpoint.id,
                roleName: role.name,
                isAllow: defaultAllow,
              })
              .orIgnore()
              .execute();

            missingPermissionsCount++;
          }
        }
      }

      if (missingPermissionsCount > 0) {
        this.logger.log(`✅ Created ${missingPermissionsCount} missing permissions`);
      } else {
        this.logger.log('✅ No missing permissions found');
      }

      await queryRunner.commitTransaction();

      const duration = Date.now() - startTime;

      this.logger.log('✅ Synchronization completed successfully');
      this.logger.log(`📊 Summary:`);
      this.logger.log(`   • Endpoints added: ${newRoutes.length}`);
      this.logger.log(`   • Missing permissions created: ${missingPermissionsCount}`);
      this.logger.log(`   • Total endpoints: ${allEndpoints.length}`);
      this.logger.log(`   • Duration: ${duration}ms`);

      return {
        success: true,
        endpointsAdded: newRoutes.length,
        permissionsCreated: missingPermissionsCount,
        total: allEndpoints.length,
        duration,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('❌ Synchronization failed', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getDefaultPermission(roleName: string, url: string, method: string): boolean {
    if (roleName === 'admin') {
      return true;
    }

    if (roleName === 'user') {
      if (method === 'GET') {
        return true;
      }
    }

    return false;
  }
}
