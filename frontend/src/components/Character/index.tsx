/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { socketClient } from '../../socket/socket';
import buildingInfoState from '../../store/buildingInfoState';
import userState from '../../store/userState';
import { UserMap, IUser, IBuilding, IObject, Direction } from '../../utils/model';

import objectInfoState from '../../store/objectInfoState';

import { NONE } from '../../utils/constants';

import {
    buildingData,
    buildingListForCharacter,
    objectData,
    objectListForCharacter,
} from '../../utils/variables/buildingData';

const commonWidth = 70;
const commonHeight = 50;

let offscreen: any;
let worker: Worker;
const cycle = 8;

export const Character = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [user, setUser] = useRecoilState(userState);
    const [characters, setCharacters] = useState<UserMap>({});
    const setBuildingInfo = useSetRecoilState(buildingInfoState);
    const setObjectInfo = useSetRecoilState(objectInfoState);

    useEffect(() => {
        const canvas: any = canvasRef.current;
        if (canvas === null) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        offscreen = canvas.transferControlToOffscreen();
        worker = new Worker('../../workers/Character/index.ts', {
            type: 'module',
        });

        worker.onmessage = async (e) => {
            const { msg } = e.data;
        };

        worker.postMessage(
            { type: 'init', offscreen, width: window.innerWidth, height: window.innerHeight },
            [offscreen],
        );
        return () => {
            worker.postMessage({ type: 'terminate' }, []);
            worker.terminate();
        };
    }, []);

    useEffect(() => {
        if (socketClient === undefined) return;
        socketClient.emit('user', user);
        socketClient.on('user', (data: UserMap) => {
            setUser(data[user.id.toString()]);
            setCharacters(data);
        });

        return () => {
            socketClient.removeListener('user');
        };
    }, [socketClient]);

    useEffect(() => {
        let frameNum = 0;
        let frameId = 0;

        const render = () => {
            frameNum += 1;
            worker.postMessage({ type: 'update', characters, user }, []);
            frameId = window.requestAnimationFrame(render);
        };
        render();

        if (socketClient === undefined) return;
        socketClient.on('move', (data: IUser) => {
            const id = data.id.toString();
            setCharacters(() => {
                characters[id] = data;
                return characters;
            });
        });

        window.addEventListener('keydown', addMoveEvent);
        window.addEventListener('keyup', addKeyUpEvent);
        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('keydown', addMoveEvent);
            window.removeEventListener('keyup', addKeyUpEvent);
            socketClient.removeListener('move');
        };
    }, [characters, user]);

    useEffect(() => {
        socketClient.emit('move', user);
    }, [user]);

    const getIndex = (x: number, y: number) => {
        return y * commonWidth + x;
    };

    const addKeyUpEvent = (event: KeyboardEvent) => {
        if (socketClient === undefined) return;
        const newLocation: IUser = {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            x: user.x,
            y: user.y,
            imageUrl: user.imageUrl,
            direction: user.direction,
            toggle: -1,
        };

        setUser(newLocation);
        socketClient.emit('move', newLocation);
    };

    const addMoveEvent = (event: KeyboardEvent) => {
        if (socketClient === undefined) return;
        const newLocation: IUser = {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            x: user.x,
            y: user.y,
            imageUrl: user.imageUrl,
            isInBuilding: user.isInBuilding,
        };

        switch (event.key) {
            case 'ArrowLeft':
                newLocation.x! -= 1;
                newLocation.direction = Direction.LEFT;
                break;
            case 'ArrowRight':
                newLocation.x! += 1;
                newLocation.direction = Direction.RIGHT;
                break;
            case 'ArrowUp':
                newLocation.y! -= 1;
                newLocation.direction = Direction.UP;
                break;
            case 'ArrowDown':
                newLocation.y! += 1;
                newLocation.direction = Direction.DOWN;
                break;
            default:
                break;
        }
        if (newLocation.x! < 0 || newLocation.x! + 1 > commonWidth) return;
        if (newLocation.y! + 1 < 0 || newLocation.y! + 2 > commonHeight) return;

        if (user.toggle !== undefined && user.direction === newLocation.direction)
            newLocation.toggle = (user.toggle + 1) % cycle;
        else newLocation.toggle = 0;

        setUser(newLocation);

        socketClient.emit('move', newLocation);

        // 건물 입장 로직
        if (user.isInBuilding === NONE) {
            isBuilding(newLocation.x!, newLocation.y!);
        } else if ((user.x! === 2 || user.x! === 3) && user.y! <= 0) {
            socketClient.emit('leaveRoom', user.isInBuilding);
            const updatedUser = { ...user };
            updatedUser.isInBuilding = -1;
            setUser(updatedUser);
        }
        isObject(newLocation.x!, newLocation.y!);
    };

    const isBuilding = (userX: number, userY: number) => {
        const bid = buildingData[getIndex(userX, userY)];
        if (bid > 0) {
            const building: IBuilding = findBuilding(bid);
            setBuildingInfo({
                isBuilding: true,
                ...building,
            });
        } else {
            setBuildingInfo({
                isBuilding: false,
                id: 0,
                x: NONE,
                y: NONE,
                uid: NONE,
                description: '',
                scope: '',
                password: '',
                imageUrl: '',
            });
        }
    };

    const findBuilding = (bid: number): IBuilding => {
        const building = buildingListForCharacter.get(bid);
        if (building === undefined) {
            return {
                id: 0,
                x: NONE,
                y: NONE,
                uid: NONE,
                description: '',
                scope: '',
                password: '',
                imageUrl: '',
            };
        }
        return building;
    };

    const isObject = (userX: number, userY: number) => {
        const oid = objectData[getIndex(userX, userY)];
        if (oid > 0) {
            const object: IObject = findObject(oid);
            setObjectInfo({
                isObject: true,
                ...object,
            });
        } else {
            setObjectInfo({
                isObject: false,
                id: 0,
                bid: NONE,
                x: NONE,
                y: NONE,
                imageUrl: '',
                fileUrl: '',
            });
        }
    };

    const findObject = (oid: number): IObject => {
        const object = objectListForCharacter.get(oid);
        if (object === undefined) {
            return {
                id: 0,
                bid: NONE,
                x: NONE,
                y: NONE,
                imageUrl: '',
                fileUrl: '',
            };
        }
        return object;
    };

    return (
        <Canvas
            id="characterCanvas"
            width={window.innerWidth}
            height={window.innerHeight}
            ref={canvasRef}
        />
    );
};

const Canvas = styled.canvas`
    bottom: 0;
    left: 0;
    z-index: 2;
    position: absolute;
    display: flex;
    right: 0;
    top: 0;
`;
