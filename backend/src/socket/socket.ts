import express from 'express';
import { Server, Socket } from 'socket.io';
import * as http from 'http';

import { getUserInfo, addUser, deleteUser } from './socket.user';
import { getBuildinginfo } from './socket.building';

import { IUser } from '../database/entities/User';
import { IBuilding } from 'src/database/entities/Building';

interface IWorldInfo {
    buildings?: IBuilding[];
}

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
        this.io = new Server(this.server, { cors: { origin: '*' } });
    }

    public connect() {
        this.io.on('connection', (socket: MySocket) => {
            console.log(`${socket.id} 연결되었습니다.`);
            socket.on('user', (data: string) =>
                this.addUserHandler(data, socket),
            );
            socket.on('enterWorld', () => this.getWorldHandler());
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

    async getWorldHandler() {
        const worldInfo: IWorldInfo = {};
        const buildings = await this.getBuildingHandler();

        worldInfo.buildings = buildings;
        console.log(worldInfo);
        this.io.emit('enterWorld', worldInfo);
    }

    async getBuildingHandler() {
        // 이미 워커로 들어온 상태이므로 select all
        const buildings = await getBuildinginfo();
        return buildings;
    }

    deleteUserHandler(socket: MySocket) {
        if (socket.uid !== undefined)
            this.userList = deleteUser(socket.uid, this.userList);
        console.log(this.userList);
        console.log(`${socket.id} 끊어졌습니다.`);
    }
}
