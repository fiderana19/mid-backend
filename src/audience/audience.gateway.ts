import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: "*" }
})
export class AudienceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AudienceGateway");
  
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  handleOrganizeAudience(payload: any): void {
    this.server.emit("new_audience_organized", payload);
  }

  handleTreateAudience(payload: any): void {
    this.server.emit("new_audience_treated", payload);
  }

  handleCloseAudience(payload: any): void {
    this.server.emit("new_audience_closed", payload);
  }

  handleMissedAudience(payload: any): void {
    this.server.emit("new_audience_missed", payload);
  }

  handleReportAudience(payload: any): void {
    this.server.emit("new_audience_reported", payload);
  }

  afterInit(server: any) {
    this.logger.log('Audience Socket Server Initialized !', server);
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected : ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected : ${client.id}`);
  }
}
