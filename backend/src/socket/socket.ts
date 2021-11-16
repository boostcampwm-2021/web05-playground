import express from 'express';
import { Server, Socket } from 'socket.io';
import * as http from 'http';

import {
    getUserInfo,
    addUserInfo,
    deleteUserInfo,
    moveUserInfo,
    isExistUserInfo,
} from './socket.user';
import { addBuildingInfo, getBuildingInfo } from './socket.building';

import { IUser } from '../database/entities/User';
import { IBuilding } from 'src/database/entities/Building';
import { getUser2, setUser2 } from 'src/database/service/user.service';

interface IWorldInfo {
    buildings?: IBuilding[];
}

interface UserMap {
    [key: string]: IUser;
}

class MySocket extends Socket {
    public uid?: number;
}

export default class RoomSocket {
    public app: express.Application;
    public port: number;
    public server?: http.Server;
    public io!: Server;
    public userMap: UserMap;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.userMap = {};
        this.server = this.app.listen(this.port, () => {
            console.log(`Socket listening on the port ${this.port}`);
        });
        this.io = new Server(this.server, { cors: { origin: '*' } });
    }

    public connect() {
        this.io.on('connection', (socket: MySocket) => {
            console.log(`${socket.id} 연결되었습니다.`);
            socket.on('user', (user: IUser) =>
                this.addUserHandler(user, socket),
            );
            socket.on('move', (data: IUser) => {
                console.log(data);
                this.moveHandler(data);
            });
            socket.on('enterWorld', () => this.getWorldHandler());
            socket.on('buildBuilding', (data: IBuilding) => {
                console.log(data);
                this.buildBuildingHandler(data);
            });
            socket.on('disconnect', () => this.deleteUserHandler(socket));
        });
    }

    async addUserHandler(user: IUser, socket: MySocket) {
        socket.uid = user.id;
        await addUserInfo(user, this.userMap);
        console.log(this.userMap);
        this.io.emit('user', this.userMap);
    }

    async moveHandler(data: IUser) {
        moveUserInfo(data, this.userMap);
        this.io.emit('move', data);
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
        const buildings = await getBuildingInfo();
        return buildings;
    }

    async buildBuildingHandler(data: IBuilding) {
        const addedBuilding = await addBuildingInfo(data);
        console.log(addedBuilding);
        this.io.emit('buildBuilding', addedBuilding);
    }

    deleteUserHandler(socket: MySocket) {
        if (socket.uid !== undefined) deleteUserInfo(socket.uid, this.userMap);
        this.io.emit('user', this.userMap);
        console.log(this.userMap);
        console.log(`${socket.id} 끊어졌습니다.`);
    }
}
