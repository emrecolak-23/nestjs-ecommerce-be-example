import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Notification } from './entity/notification.entity';

@WebSocketGateway({
  namespace: 'socket',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: Map<string, any> = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  sendNotification(notification: Notification) {
    this.server.emit('notification', notification);
  }
}
