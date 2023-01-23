import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway(8080, {
	cors: {
		origin: '*',
	},
})
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): any {
		// return from([1, 2, 3]).pipe(map((item) => ({event: 'events', data: item})));
		this.server.emit('events', data);
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}
}
