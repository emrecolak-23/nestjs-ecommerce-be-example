import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Endpoint } from './endpoint/entities/endpoint.entity';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter, ResponseInterceptor, RolesInterceptor } from './common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './common';
import { RoleModule } from './role/role.module';
import { EndpointModule } from './endpoint/endpoint.module';
import { PermissionsModule } from './permissions/permissions.module';
import { Permission } from './permissions/entities/permission.entity';
import { EndpointSeedService } from './common';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { UploadModule } from './upload/upload.module';
import { ProductGalleriesModule } from './product-galleries/product-galleries.module';
import { ProductGallery } from './product-galleries/entities/product-gallery.entity';
import { VariantModule } from './variant/variant.module';
import { Variant } from './variant/entities/variant.entity';
import { VariantItemsModule } from './variant-items/variant-items.module';
import { VariantItems } from './variant-items/entities/variant-items.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { ShippingAddress } from './shipping-address/entities/shipping-address.entity';
import { ShippingRuleModule } from './shipping-rule/shipping-rule.module';
import { ShippingRule } from './shipping-rule/entities/shipping-rule.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { OrderDetail } from './order/entities/order-detail.entity';
import { EmailModule } from './email/email.module';
import { ListenersModule } from './listeners/listeners.module';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: { target: 'pino-pretty' },
        serializers: {
          req: (req) => {
            const contentType = req.headers['content-type'];
            let body;

            if (contentType?.includes('application/json')) {
              try {
                body = JSON.stringify(JSON.parse(req.raw.body), null, 2);
              } catch (error) {
                body = req.raw.body;
              }
            } else {
              body = req.raw.body;
            }

            return {
              method: req.method,
              url: req.url,
              params: req.params,
              query: req.query,
              contentType,
              body,
            };
          },
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Role,
          Endpoint,
          Permission,
          Category,
          Product,
          ProductGallery,
          Variant,
          VariantItems,
          Cart,
          CartItem,
          ShippingAddress,
          ShippingRule,
          Order,
          OrderDetail,
          Review,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    EndpointModule,
    PermissionsModule,
    CategoryModule,
    ProductModule,
    UploadModule,
    ProductGalleriesModule,
    VariantModule,
    VariantItemsModule,
    CartModule,
    ShippingAddressModule,
    ShippingRuleModule,
    OrderModule,
    EmailModule,
    ListenersModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RolesInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    EndpointSeedService,
  ],
})
export class AppModule {}
