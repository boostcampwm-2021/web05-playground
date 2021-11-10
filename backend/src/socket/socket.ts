import express from 'express';
import { Server, Socket } from 'socket.io';
import { getUserInfo, addUser, deleteUser } from './socket.user';
import { IUser } from '../database/entities/User';
import * as http from 'http';

class MySocket extends Socket {
    public uid?: number;
}

export default class RoomSocket {
    public app: express.Application;
    public port: number;
    public server?: http.Server;
    public io!: Server;
    public userList: Array<IUser> = [];

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.server = this.app.listen(this.port, () => {
            console.log(`Socket listening on the port ${this.port}`);
        });
        this.io = new Server(this.server, {cors: {origin: '*'}});
    }
    
    public connect() {
        this.io.on('connection', (socket: MySocket) => {
            console.log(`${socket.id} 연결되었습니다.`);
            socket.on('user', (data: string) => this.addUserHandler(data, socket));
            socket.on('disconnect', () => this.deleteUserHandler(socket));
        });
    }

    async addUserHandler(data: string, socket: MySocket) {
        const user = await getUserInfo(data);
        socket.uid = user.id;
        addUser(user, this.userList);
        console.log(this.userList);
        this.io.emit('user', this.userList);
    }

    deleteUserHandler(socket: MySocket) {
        if(socket.uid !== undefined) this.userList = deleteUser(socket.uid, this.userList);
        console.log(this.userList)
        console.log(`${socket.id} 끊어졌습니다.`);
    }
}