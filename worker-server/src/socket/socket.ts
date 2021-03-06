import express from 'express';
import { Server, Socket } from 'socket.io';
import * as http from 'http';

import { addUserInfo, deleteUserInfo, moveUserInfo } from './socket.user';
import { addBuildingInfo, getBuildingInfo } from './socket.building';
import { addObjectInfo, getObjectInfo } from './socket.object';

import { IUser } from '../database/entities/User';
import { IBuilding } from '../database/entities/Building';
import { IObject } from '../database/entities/Object';

import { WORLD, ROOM_CAPACITY } from '../shared/constants';
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
    target: string;
}

class MySocket extends Socket {
    public uid?: number;
}

interface IEnter {
    user: IUser;
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
            socket.on('user', (user: IUser) =>
                this.addUserHandler(user, socket),
            );
            socket.on('move', (data: IUser) => {
                this.moveHandler(data);
            });
            socket.on('checkCapacity', (data: string) => {
                const usersInRoom = rooms.get(data);
                const isFull =
                    usersInRoom === undefined ||
                    usersInRoom.length < ROOM_CAPACITY
                        ? false
                        : true;
                this.io.sockets.to(socket.id).emit('checkCapacity', isFull);
            });
            socket.on('enter', (data: IEnter) => {
                this.allUserHandler(socket);
                this.getWorldHandler(socket, data);
            });
            socket.on('buildBuilding', (data: IBuilding) => {
                this.buildBuildingHandler(data);
            });

            socket.on('buildObject', (data: IObject) => {
                this.buildObjectHandler(data);
            });

            socket.on('message', (data: Message, roomName: string) => {
                this.messageHandler(data, roomName);
            });

            socket.on('leaveRoom', (data: number) => {
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

            socket.on('switch', (data) => {
                for (const room of socket.rooms) {
                    if (room !== socket.id) {
                        this.io.sockets.to(room).emit('switch', data);
                    }
                }
            });

            socket.on('disconnecting', () => {
                for (const room of socket.rooms) {
                    if (room !== socket.id) {
                        this.leaveRoomHandler(parseInt(room), socket);
                    }
                }
            });

            socket.on('disconnect', () => {
                this.deleteUserHandler(socket);
            });
        });
    }

    async addUserHandler(user: IUser, socket: MySocket) {
        socket.uid = user.id;
        await addUserInfo(user, this.userMap);
        this.io.emit('user', this.userMap);
    }

    allUserHandler(socket: MySocket) {
        socket.emit('allUserList', this.userMap);
    }

    async moveHandler(data: IUser) {
        moveUserInfo(data, this.userMap);
        this.io.emit('move', data);
    }

    async getWorldHandler(socket: MySocket, data: IEnter) {
        const worldInfo: IWorldInfo = {};
        const buildings =
            data.roomId === WORLD ? await this.getBuildingHandler() : [];
        const objects = await this.getObjectHandler(
            data.roomId === WORLD ? 1 : data.roomId,
        );
        if (data.roomId !== WORLD) {
            this.joinRoomHandler(data.roomId, socket);
        }

        worldInfo.buildings = buildings;
        worldInfo.objects = objects;

        socket.emit('enter', worldInfo);
        this.io.emit('enterNewPerson', data.user);
    }

    async getBuildingHandler() {
        const buildings = await getBuildingInfo();
        return buildings;
    }

    async buildBuildingHandler(data: IBuilding) {
        const addedBuilding = await addBuildingInfo(data);
        this.io.emit('buildBuilding', addedBuilding);
    }

    async getObjectHandler(bid: number) {
        const objects = await getObjectInfo(bid);
        return objects;
    }

    async buildObjectHandler(data: IObject) {
        const addedObject = await addObjectInfo(data);
        this.io.emit('buildObject', addedObject);
    }

    async messageHandler(data: Message, roomName: string) {
        if (roomName === 'Everyone') {
            data.target = 'World';
            this.io.emit('message', data);
            return;
        }
        data.target = 'Building';
        this.io.to(roomName).emit('message', data);
    }

    async deleteUserHandler(socket: MySocket) {
        if (socket.uid !== undefined)
            await deleteUserInfo(socket.uid, this.userMap);
        this.io.emit('user', this.userMap);
        this.io.emit('exitUser', this.userMap);
    }

    async joinRoomHandler(data: number, socket: MySocket) {
        const roomId = data.toString(10);
        socket.join(roomId);

        const usersInRoom = rooms.get(roomId);
        if (usersInRoom === undefined) {
            rooms.set(roomId, [socket.id]);
        } else {
            usersInRoom.push(socket.id);
        }

        const others = rooms
            .get(roomId)
            .filter((user: string) => user !== socket.id);

        this.io.sockets
            .to(socket.id)
            .emit('others', others === undefined ? [] : others);
    }

    async leaveRoomHandler(data: number, socket: MySocket) {
        if (socket.uid) this.userMap[socket.uid].isInBuilding = -1;
        const roomId = data.toString(10);
        socket.leave(roomId);
        const users = rooms
            .get(roomId)
            .filter((user: string) => socket.id !== user);
        rooms.set(roomId, users);
        this.io.sockets.to(roomId).emit('userExit', socket.id);
    }
}
