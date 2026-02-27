import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: "*" },
})
export class RequestGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("Request999Gateway");

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.logger.log(`999 : ${client.id}`);
    this.server.emit('msgToClient', payload, client.id);
  }

  handleCreateRequest(payload: any): void {
    this.server.emit('new_request_created', payload);
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
