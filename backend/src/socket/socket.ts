import express from 'express';
import { Server } from 'socket.io';

export default class Socket {
    public app: express.Application;
    public port: number;
    public server: any;
    public io: any;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }
    
    public listen() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Socket listening on the port ${this.port}`);
        });
        this.io = new Server(this.server);
    }

    public connect() {
        this.io.on('connection', (socket: any) => {
            console.log(`${socket.id} 연결되었습니다.`);

            socket.on('msg', (data: any) => {
                console.log(`Server : "${data}" 받았습니다.`);
            });

            socket.on('disconnect', (socket: any) => {
                console.log(`${socket} 끊어졌습니다.`);
            })
        });
    }
}