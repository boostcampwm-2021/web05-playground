/* eslint-disable consistent-return */
import { DefaultEventsMap } from '@socket.io/component-emitter';
import React, { useRef, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import io, { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { socketClient } from '../../socket/socket';
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

export const Character = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [user, setUser] = useRecoilState(userState);
    const [characters, setCharacters] = useState<UserMap>({});
    const imgSrcMap: imgSrc = {};

    const characterWidth = 32;
    const characterHeight = 64;

    useEffect(() => {
        if (socketClient === undefined) return;
        socketClient.emit('user', user.id);
        socketClient.on('user', (data: UserMap) => {
            if (user.imageUrl === 'none') setUser(data[user.id.toString()]);

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

        window.addEventListener('keydown', addMoveEvent);
        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('keydown', addMoveEvent);
        };
    }, [characters]);

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
                    dx,
                    dy,
                    characterWidth,
                    characterHeight,
                );
            } else {
                // other-Char
                const distanceX = (character.x - user.x) * characterWidth;
                const distanceY = (character.y - user.y) * characterWidth;

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
        switch (event.key) {
            case 'ArrowLeft':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x - 1,
                    y: user.y,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.LEFT,
                });
                break;
            case 'ArrowRight':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x + 1,
                    y: user.y,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.RIGHT,
                });
                break;
            case 'ArrowUp':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x,
                    y: user.y - 1,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.UP,
                });
                break;
            case 'ArrowDown':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x,
                    y: user.y + 1,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.DOWN,
                });
                break;
            default:
                break;
        }
    };

    return <Canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} />;
};

const Canvas = styled.canvas`
    bottom: 0;
    left: 0;
    z-index: 100;
    position: absolute;
    display: flex;
    right: 0;
    top: 0;
`;

/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/*
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
        socketClient.emit('user', user.id);
        socketClient.on('user', (data: UserMap) => {
            setOthers(data);
            if (user.imageUrl === 'none') {
                setUser(data[user.id.toString()]);
            }
            Object.keys(data).forEach((id) => {
                imgSrcMap[id] = new Image();
                imgSrcMap[id].src = data[id].imageUrl;
            });
        });
    }, [socketClient]);

    useEffect(() => {
        if (socketClient === undefined) return;
        let frameId = 0;
        let frameNum = 0;

        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        const render = (ctx: CanvasRenderingContext2D | null) => {
            frameNum += 1;
            ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            drawCharacters(others, ctx);
            frameId = window.requestAnimationFrame(() => render(ctx));
        };
        render(ctx);

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

        window.addEventListener('keydown', addMoveEvent, { once: true });

        return () => {
            window.removeEventListener('keydown', addMoveEvent);
            socketClient.removeListener('move'); // 기존 코드는 removeAll로 되어있었음
        };
    }, [others, user]);

    const drawCharacters = (others: UserMap, ctx: CanvasRenderingContext2D | null) => {
        if (!ctx) return;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileWidth);
        const dy = height - (height % tileWidth);

        Object.keys(others).forEach((id) => {
            if (id === user.id.toString()) drawMyCharacter(ctx, dx, dy);
            else drawOtherCharacter(ctx, parseInt(id, 10), dx, dy);
        });
    };

    const drawMyCharacter = (ctx: CanvasRenderingContext2D | null, dx: number, dy: number) => {
        if (!ctx) return;

        const myCharacterSrc = imgSrcMap[user.id.toString()];
        if (myCharacterSrc === undefined) {
            imgSrcMap[user.id.toString()] = new Image();
            imgSrcMap[user.id.toString()].src = user.imageUrl;
        }
        imgSrcMap[user.id.toString()].onload = () => {
            ctx.drawImage(
                myCharacterSrc!,
                0,
                0,
                tileWidth,
                tileHeight,
                dx,
                dy,
                tileWidth,
                tileHeight,
            );
        };
    };

    const drawOtherCharacter = (
        ctx: CanvasRenderingContext2D | null,
        id: number,
        dx: number,
        dy: number,
    ) => {
        if (!ctx || others[id.toString()] === undefined) return;

        const other = others[id.toString()];
        const distanceX = (other!.x - user.x) * tileWidth;
        const distanceY = (other!.y - user.y) * tileWidth;

        if (Math.abs(distanceX) > dx || Math.abs(distanceY) > dy) return;

        const otherCharacterSrc = imgSrcMap[other.id.toString()];
        if (otherCharacterSrc === undefined) {
            imgSrcMap[id.toString()] = new Image();
            imgSrcMap[id.toString()].src = others[id.toString()].imageUrl;
        }
        imgSrcMap[id.toString()].onload = () => {
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
    };

    const addMoveEvent = (event: KeyboardEvent) => {
        if (socketClient === undefined) return;
        switch (event.key) {
            case 'ArrowLeft':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x - 1,
                    y: user.y,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.LEFT,
                });
                break;
            case 'ArrowRight':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x + 1,
                    y: user.y,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.RIGHT,
                });
                break;
            case 'ArrowUp':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x,
                    y: user.y - 1,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.UP,
                });
                break;
            case 'ArrowDown':
                setUser({
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    x: user.x,
                    y: user.y + 1,
                    imageUrl: user.imageUrl,
                });
                socketClient.emit('move', {
                    id: user.id,
                    email: user.email,
                    direction: Direction.DOWN,
                });
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
*/
