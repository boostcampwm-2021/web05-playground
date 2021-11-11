/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
import { DefaultEventsMap } from '@socket.io/component-emitter';
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import io, { Socket } from 'socket.io-client';
import styled from 'styled-components';
import userState from '../../store/userState';
import { socketClient } from '../../socket/socket';

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

export const Character = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [user, setUser] = useRecoilState(userState);
    const [others, setOthers] = useState<Map<number, IUser>>(new Map<number, IUser>());
    const imgSrcMap = new Map<number, HTMLImageElement>();

    const tileWidth = 32;
    const tileHeight = 64;

    useEffect(() => {
        if (socketClient === undefined) return;
        socketClient.emit('user', user.uid);
        socketClient.on('user', (data: string) => {
            setOthers(JSON.parse(data));
        });
        socketClient.on('move', (data: UserMove) => {
            const newOthers: Map<number, IUser> = JSON.parse(JSON.stringify(others));
            const moved = newOthers.get(data.id);
            if (data.direction === Direction.DOWN) moved!.y += 1;
            else if (data.direction === Direction.UP) moved!.y -= 1;
            else if (data.direction === Direction.LEFT) moved!.x -= 1;
            else if (data.direction === Direction.RIGHT) moved!.x += 1;
            newOthers.set(data.id, moved!);
            setOthers(newOthers);
        });
        return () => {
            socketClient.removeAllListeners();
        };
    }, [socketClient]);

    useEffect(() => {
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

        [...others!].forEach(([id, other]) => {
            if (imgSrcMap.has(other.id)) return;
            const characterImg = new Image();
            characterImg.src = other.imageUrl;
            characterImg.onload = () => {
                imgSrcMap.set(other.id, characterImg);
                render(ctx!, other.id);
            };
        });

        window.addEventListener('keydown', (e) => addMoveEvent(e, socketClient));
        return () => {
            window.removeEventListener('keydown', (e) => addMoveEvent(e, socketClient));
        };
    }, [others, user]);

    const drawMyCharacter = (ctx: CanvasRenderingContext2D | null) => {
        if (!ctx) return;
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileWidth);
        const dy = height - (height % tileWidth);
        const myCharacterSrc = imgSrcMap.get(user.uid);
        ctx.drawImage(myCharacterSrc!, 0, 0, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);
    };

    const drawOtherCharacter = (ctx: CanvasRenderingContext2D | null, id: number) => {
        if (!ctx || others.get(id) === undefined) return;
        const other = others.get(id);
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileWidth);
        const dy = height - (height % tileWidth);
        const distanceX = (other!.x - user.x) * tileWidth;
        const distanceY = (other!.y - user.y) * tileWidth;
        if (Math.abs(distanceX) > dx || Math.abs(distanceY) > dy) return;
        const otherCharacterSrc = imgSrcMap.get(other!.id);
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

    const addMoveEvent = (
        event: KeyboardEvent,
        socketClient: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) => {
        switch (event.key) {
            case 'ArrowLeft':
                setUser({
                    uid: user.uid,
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
                break;
            case 'ArrowRight':
                setUser({
                    uid: user.uid,
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
                break;
            case 'ArrowUp':
                setUser({
                    uid: user.uid,
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
                break;
            case 'ArrowDown':
                setUser({
                    uid: user.uid,
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
    position: absolute;
    right: 0;
    top: 0;
`;
