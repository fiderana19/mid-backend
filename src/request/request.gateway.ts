import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: "*" },
})
export class RequestGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("RequestGateway");

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.logger.log(`Client connected : ${client.id}`);
    this.server.emit('msgToClient', payload, client.id);
  }

  handleCreateRequest(payload: any): void {
    this.server.emit('new_request_created', payload);
  }

  handleAcceptRequest(payload: any): void {
    this.server.emit('new_request_accepted', payload);
  }

  handleDenyRequest(payload: any): void {
    this.server.emit('new_request_denied', payload);
  }

  handleUpdateRequest(payload: any): void {
    this.server.emit('new_request_updated', payload);
  }

  handleDeleteRequest(payload: any): void {
    this.server.emit('new_request_deleted', payload);
  }

  handleDeleteManyRequestByUser(payload: any): void {
    this.server.emit('new_request_deleted_by_user', payload);
  }
  
  afterInit(server: Server) {
    this.logger.log('Init !!!', server);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected : ${client.id}`);
  }
}
