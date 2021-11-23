/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { socketClient } from '../../socket/socket';
import buildingInfoState from '../../store/buildingInfoState';
import userState from '../../store/userState';
import { UserMap, IUser, IBuilding, IObject } from '../../utils/model';

import isInBuildingState from '../../store/isInBuildingState';
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

export const Character = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [user, setUser] = useRecoilState(userState);
    const [characters, setCharacters] = useState<UserMap>({});
    const setBuildingInfo = useSetRecoilState(buildingInfoState);
    const setObjectInfo = useSetRecoilState(objectInfoState);
    const [isInBuilding, setIsInBuilding] = useRecoilState(isInBuildingState);

    const characterWidth = 32;
    const characterHeight = 64;

    useEffect(() => {
        if (socketClient === undefined) return;
        socketClient.emit('user', user);
        socketClient.on('user', (data: UserMap) => {
            setUser(data[user.id.toString()]);
            setCharacters(data);
        });
    }, [socketClient]);

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) return;
        const ctx = canvas.getContext('2d');

        let frameNum = 0;
        let frameId = 0;

        const render = () => {
            frameNum += 1;
            draw(ctx);
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
        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('keydown', addMoveEvent);
            socketClient.removeListener('move');
        };
    }, [characters, user, isInBuilding]);

    const getIndex = (x: number, y: number) => {
        return y * commonWidth + x;
    };

    const draw = (ctx: CanvasRenderingContext2D | null) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % characterWidth);
        const dy = height - (height % characterWidth);

        Object.keys(characters).forEach((id) => {
            const character = characters[id];
            if (id === user.id.toString()) {
                // my-Char
                const characterImg = new Image();
                characterImg.src = character.imageUrl;

                ctx.drawImage(
                    characterImg,
                    0,
                    0,
                    characterWidth,
                    characterHeight,
                    user.x! * characterWidth < dx ? user.x! * characterWidth : dx,
                    user.y! * characterWidth < dy ? user.y! * characterWidth : dy,
                    characterWidth,
                    characterHeight,
                );
            } else {
                // other-Char
                const distanceX = (character.x! - user.x!) * characterWidth;
                const distanceY = (character.y! - user.y!) * characterWidth;

                const characterImg = new Image();
                characterImg.src = character.imageUrl;
                ctx.drawImage(
                    characterImg,
                    0,
                    0,
                    characterWidth,
                    characterHeight,
                    dx + distanceX,
                    dy + distanceY,
                    characterWidth,
                    characterHeight,
                );
            }
        });
    };

    const addMoveEvent = (event: KeyboardEvent) => {
        if (socketClient === undefined) return;

        const newLocation = {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            x: user.x,
            y: user.y,
            imageUrl: user.imageUrl,
        };

        switch (event.key) {
            case 'ArrowLeft':
                newLocation.x! -= 1;
                break;
            case 'ArrowRight':
                newLocation.x! += 1;
                break;
            case 'ArrowUp':
                newLocation.y! -= 1;
                break;
            case 'ArrowDown':
                newLocation.y! += 1;
                break;
            default:
                break;
        }

        setUser(newLocation);
        socketClient.emit('move', newLocation);
        // 건물 입장 로직
        if (isInBuilding === NONE) {
            isBuilding(newLocation.x!, newLocation.y!);
        } else if ((user.x! === 2 || user.x! === 3) && user.y! <= 0) {
            socketClient.emit('leaveRoom', isInBuilding);
            setIsInBuilding(NONE);
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
                x: -1,
                y: -1,
                uid: -1,
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
