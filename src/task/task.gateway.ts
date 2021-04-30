import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as config from 'config';
import { Logger } from '@nestjs/common';

const socketConfig = config.get('socket');

@WebSocketGateway()
export class TaskGateway implements OnGatewayInit {
    @SubscribeMessage(socketConfig.update)
    handleUpdateMessage(client: Socket, payload: string): void {
        this.logActivity(socketConfig.update);
        client.broadcast.emit(socketConfig.update, payload);
    }

    @SubscribeMessage(socketConfig.delete)
    handleDeleteMessage(client: Socket, payload: string): void {
        this.logActivity(socketConfig.delete);
        client.emit(socketConfig.delete, payload);
        client.broadcast.emit(socketConfig.delete, payload);
    }

    @SubscribeMessage(socketConfig.add)
    handleAddMessage(client: Socket, payload: string): void {
        this.logActivity(socketConfig.add);
        client.broadcast.emit(socketConfig.add, payload);
    }

    private logActivity(messageType: string) {
        Logger.log(`Forwarding ${messageType} message`, this.constructor.name);
    }

    afterInit() {
        Logger.log('Socket gateway initialized', this.constructor.name);
    }
}
