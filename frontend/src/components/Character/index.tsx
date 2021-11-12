/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
import { DefaultEventsMap } from '@socket.io/component-emitter';
import React, { useRef, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import io, { Socket } from 'socket.io-client';
import styled from 'styled-components';
import userState from '../../store/userState';

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

interface UserMove {
    id: number;
    email: string;
    direction: Direction;
}

interface IUser {
    id: number;
    email: string;
    nickname: string;
    x: number;
    y: number;
    imageUrl: string;
}

interface UserMap {
    [key: string]: IUser;
}

interface imgSrc {
    [key: string]: HTMLImageElement;
}

export const Character = ({ socketClient }: { socketClient: Socket }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [user, setUser] = useRecoilState(userState);
    const [others, setOthers] = useState<UserMap>({});
    const imgSrcMap: imgSrc = {};

    const tileWidth = 32;
    const tileHeight = 64;

    useEffect(() => {
        if (socketClient === undefined) return;
        socketClient.emit('user', user.uid);
        socketClient.on('user', (data: UserMap) => {
            setOthers(data);
        });
    }, [socketClient]);

    useEffect(() => {
        if (socketClient === undefined) return;
        let frameId = 0;
        let frameNum = 0;
        const render = (ctx: CanvasRenderingContext2D, id: number) => {
            frameNum += 1;
            if (id === user.uid) drawMyCharacter(ctx);
            else drawOtherCharacter(ctx, id);
            frameId = window.requestAnimationFrame(() => render(ctx, id));
        };

        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        socketClient.on('move', (data: UserMove) => {
            const newOthers: UserMap = JSON.parse(JSON.stringify(others));
            const moved = newOthers[data.id.toString()];
            if (data.direction === Direction.DOWN) moved!.y += 1;
            else if (data.direction === Direction.UP) moved!.y -= 1;
            else if (data.direction === Direction.LEFT) moved!.x -= 1;
            else if (data.direction === Direction.RIGHT) moved!.x += 1;
            newOthers[data.id] = moved;
            setOthers(newOthers);
        });

        Object.keys(others).forEach((id) => {
            const other = others[parseInt(id, 10)];
            const characterImg = new Image();
            characterImg.src = other.imageUrl;
            characterImg.onload = () => {
                imgSrcMap[other.id] = characterImg;
                render(ctx!, other.id);
            };
        });

        window.addEventListener('keydown', addMoveEvent);
        return () => {
            window.removeEventListener('keydown', addMoveEvent);
            socketClient.removeListener('move'); // 기존 코드는 removeAll로 되어있었음
        };
    }, [others, user]);

    const drawMyCharacter = (ctx: CanvasRenderingContext2D | null) => {
        if (!ctx) return;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileWidth);
        const dy = height - (height % tileWidth);
        const myCharacterSrc = imgSrcMap[user.uid.toString()];
        ctx.drawImage(
            myCharacterSrc!,
            0,
            0,
            tileWidth,
            tileHeight,
            user.x * tileWidth < dx ? user.x * tileWidth : dx,
            user.y * tileWidth < dy ? user.y * tileWidth : dy,
            tileWidth,
            tileHeight,
        );
    };

    const drawOtherCharacter = (ctx: CanvasRenderingContext2D | null, id: number) => {
        if (!ctx || others[id.toString()] === undefined) return;
        const other = others[id.toString()];
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileWidth);
        const dy = height - (height % tileWidth);
        const distanceX = (other!.x - user.x) * tileWidth;
        const distanceY = (other!.y - user.y) * tileWidth;
        if (Math.abs(distanceX) > dx || Math.abs(distanceY) > dy) return;
        const otherCharacterSrc = imgSrcMap[other.id.toString()];
        ctx.drawImage(
            otherCharacterSrc!,
            0,
            0,
            tileWidth,
            tileHeight,
            dx + distanceX,
            dy + distanceY,
            tileWidth,
            tileHeight,
        );
    };

    const addMoveEvent = (event: KeyboardEvent) => {
        if (socketClient === undefined) return;
        switch (event.key) {
            case 'ArrowLeft':
                if (user.x > 0) {
                    setUser({
                        uid: user.uid,
                        nickname: user.nickname,
                        email: user.email,
                        x: user.x - 1,
                        y: user.y,
                        imageUrl: user.imageUrl,
                    });
                    socketClient.emit('move', {
                        id: user.uid,
                        email: user.email,
                        direction: Direction.LEFT,
                    });
                }
                break;
            case 'ArrowRight':
                if (user.x < 70) {
                    setUser({
                        uid: user.uid,
                        nickname: user.nickname,
                        email: user.email,
                        x: user.x + 1,
                        y: user.y,
                        imageUrl: user.imageUrl,
                    });
                    socketClient.emit('move', {
                        id: user.uid,
                        email: user.email,
                        direction: Direction.RIGHT,
                    });
                }
                break;
            case 'ArrowUp':
                if (user.y > 0) {
                    setUser({
                        uid: user.uid,
                        nickname: user.nickname,
                        email: user.email,
                        x: user.x,
                        y: user.y - 1,
                        imageUrl: user.imageUrl,
                    });
                    socketClient.emit('move', {
                        id: user.uid,
                        email: user.email,
                        direction: Direction.UP,
                    });
                }
                break;
            case 'ArrowDown':
                if (user.y < 50) {
                    setUser({
                        uid: user.uid,
                        nickname: user.nickname,
                        email: user.email,
                        x: user.x,
                        y: user.y + 1,
                        imageUrl: user.imageUrl,
                    });
                    socketClient.emit('move', {
                        id: user.uid,
                        email: user.email,
                        direction: Direction.DOWN,
                    });
                }
                break;
            default:
                break;
        }
    };

    return <Canvas id="canvas" ref={canvasRef} />;
};

const Canvas = styled.canvas`
    bottom: 0;
    left: 0;
    z-index: 2;
    position: absolute;
    right: 0;
    top: 0;
`;
