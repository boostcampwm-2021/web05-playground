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
import { addObjectInfo, getObjectInfo } from './socket.object';

import { IUser } from '../database/entities/User';
import { IBuilding } from 'src/database/entities/Building';
import { getUser2, setUser2 } from 'src/database/service/user.service';
import { IObject } from 'src/database/entities/Object';

interface IWorldInfo {
    buildings?: IBuilding[];
    objects?: IObject[];
}

interface UserMap {
    [key: string]: IUser;
}

interface Message {
    id: string;
    message: string;
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
            socket.on('enterWorld', () => this.getWorldHandler(socket));
            socket.on('buildBuilding', (data: IBuilding) => {
                console.log(data);
                this.buildBuildingHandler(data);
            });

            socket.on('buildObject', (data: IObject) => {
                console.log(data);
                this.buildObjectHandler(data);
            });

            socket.on('message', (data: Message, roomName: string) => {
                this.messageHandler(data, roomName);
            });

            socket.on('joinRoom', (data: string) => {
                this.joinRoomHandler(data, socket);
            });

            socket.on('leaveRoom', (data: string) => {
                this.leaveRoomHandler(data, socket);
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

    async getWorldHandler(socket: MySocket) {
        const worldInfo: IWorldInfo = {};
        const buildings = await this.getBuildingHandler();
        const objects = await this.getObjectHandler(1);

        worldInfo.buildings = buildings;
        worldInfo.objects = objects;
        console.log(worldInfo);
        socket.emit('enterWorld', worldInfo);
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

    async getObjectHandler(bid: number) {
        const objects = await getObjectInfo(bid);
        return objects;
    }

    async buildObjectHandler(data: IObject) {
        const addedObject = await addObjectInfo(data);
        console.log(addedObject);
        this.io.emit('buildObject', addedObject);
    }

    async messageHandler(data: Message, roomName: string) {
        if (roomName === 'Everyone') {
            this.io.emit('message', data);
            return;
        }
        this.io.to(roomName).emit('message', data);
    }

    deleteUserHandler(socket: MySocket) {
        if (socket.uid !== undefined) deleteUserInfo(socket.uid, this.userMap);
        this.io.emit('user', this.userMap);
        console.log(this.userMap);
        console.log(`${socket.id} 끊어졌습니다.`);
    }

    async joinRoomHandler(data: string, socket: MySocket) {
        const roomId = data;
        socket.join(roomId);
        const objects = await this.getObjectHandler(parseInt(data));
        //this.io.to(data).emit('roomObjectList', objects);
        socket.emit('roomObjectList', objects);
        //socket.to(data).emit('enterNewPerson', data);
    }

    async leaveRoomHandler(data: string, socket: MySocket) {
        const roomId = data;
        socket.leave(roomId);
    }
}
