import { Module } from '@nestjs/common';
import { OrderCreatedListener } from './order-created.listener';
import { UserCreatedListener } from './user-created.listener';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [OrderCreatedListener, UserCreatedListener],
})
export class ListenersModule {}
