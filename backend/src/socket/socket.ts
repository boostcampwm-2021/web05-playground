import express from 'express';
import { Server } from 'socket.io';
import { getUserInfo, addUser, deleteUser } from './socket.user';
import { IUser } from '../database/entities/User';

export default class Socket {
    public app: express.Application;
    public port: number;
    public server: any;
    public io: any;
    public userList: Array<IUser> = [];

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }
    
    public listen() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Socket listening on the port ${this.port}`);
        });
        this.io = new Server(this.server, {cors: {origin: '*'}});
    }

    public connect() {
        this.io.on('connection', (socket: any) => {
            console.log(`${socket.id} 연결되었습니다.`);

            socket.on('user', async (data:string) => {
                const user = await getUserInfo(data);
                socket.email = user.email;

                addUser(user, this.userList);

                console.log(this.userList);
                socket.broadcast.emit('user', this.userList);
            })

            socket.on('disconnect', () => {
                this.userList = deleteUser(socket.email, this.userList);
                console.log(this.userList);
                console.log(`${socket.email} 끊어졌습니다.`);
            })
        });
    }
}