import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as config from 'config';
import { Logger } from '@nestjs/common';

const socketGateway = config.get('server').socketGateway;

@WebSocketGateway()
export class TaskGateway implements OnGatewayInit {
    @SubscribeMessage(socketGateway)
    handleMessage(client: Socket, payload: string): void {
        client.broadcast.emit(socketGateway, payload);
    }

    afterInit() {
        Logger.log('Socket gateway initialized', this.constructor.name);
    }
}
