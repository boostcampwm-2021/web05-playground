import express from 'express';
import { Server, Socket } from 'socket.io';
import * as http from 'http';

import { addUserInfo, deleteUserInfo, moveUserInfo } from './socket.user';
import { addBuildingInfo, getBuildingInfo } from './socket.building';
import { addObjectInfo, getObjectInfo } from './socket.object';

import { IUser } from '../database/entities/User';
import { IBuilding } from 'src/database/entities/Building';
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

interface IEnter {
    user: string;
    roomId: number;
}

const rooms = new Map();

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
            socket.on('enter', (data: IEnter) =>
                this.getWorldHandler(socket, data),
            );
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

            socket.on('leaveRoom', (data: string) => {
                this.leaveRoomHandler(data, socket);
            });

            socket.on('offer', (data) => {
                this.io.to(data.offerReceiveID).emit('offer', {
                    sdp: data.sdp,
                    offerSendID: data.offerSendID,
                });
            });

            socket.on('answer', (data) => {
                this.io.to(data.answerReceiveID).emit('answer', {
                    sdp: data.sdp,
                    answerSendID: data.answerSendID,
                });
            });

            socket.on('candidate', (data) => {
                socket.to(data.candidateReceiveID).emit('ice', {
                    candidate: data.candidate,
                    candidateSendID: data.candidateSendID,
                });
            });

            socket.on('disconnect', () => {
                this.deleteUserHandler(socket);
            });
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

    async getWorldHandler(socket: MySocket, data: IEnter) {
        const worldInfo: IWorldInfo = {};
        const buildings =
            data.roomId === -1 ? await this.getBuildingHandler() : [];
        const objects = await this.getObjectHandler(
            data.roomId === -1 ? 1 : data.roomId,
        );
        if (data.roomId !== -1) {
            this.joinRoomHandler(data.roomId, socket);
        }

        worldInfo.buildings = buildings;
        worldInfo.objects = objects;
        console.log(worldInfo);

        socket.emit('enter', worldInfo);
        this.io.emit('enterNewPerson', data.user);
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

    async joinRoomHandler(data: number, socket: MySocket) {
        const roomId = data.toString();
        socket.join(roomId);

        // const usersInRoom = rooms.get(roomId);
        // if (usersInRoom === undefined) {
        //     rooms.set(roomId, [socket.id]);
        // } else {
        //     usersInRoom.push(socket.id);
        // }

        // const others = rooms
        //     .get(roomId)
        //     .filter((user: string) => user !== socket.id);

        // this.io.sockets
        //     .to(socket.id)
        //     .emit('others', others === undefined ? [] : others);
    }

    async leaveRoomHandler(data: string, socket: MySocket) {
        const roomId = data;
        socket.leave(roomId);
    }
}
