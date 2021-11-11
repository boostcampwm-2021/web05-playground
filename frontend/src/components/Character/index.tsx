/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import io, { Socket } from 'socket.io-client';
import styled from 'styled-components';
import userState from '../../store/userState';

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
    const imgSrcMap = new Map<string, HTMLImageElement>();

    let socketClient;

    const tileWidth = 32;
    const tileHeight = 64;

    useEffect(() => {
        socketClient = io(process.env.REACT_APP_BASE_SOCKET_URI!);
        socketClient.emit('user', 'minjaec023@gmail.com');
        socketClient.on('user', (data: string) => {
            setOthers(JSON.parse(data));
        });
    }, []);

    useEffect(() => {
        let frameId = 0;
        let frameNum = 0;
        const render = (ctx: CanvasRenderingContext2D) => {
            frameNum += 1;
            drawMyCharacter(ctx);
            frameId = window.requestAnimationFrame(() => render(ctx));
        };

        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        [...others!].forEach(([id, other]) => {
            if (imgSrcMap.has(other.email)) return;
            const characterImg = new Image();
            characterImg.src = other.imageUrl;
            characterImg.onload = () => {
                imgSrcMap.set(other.email, characterImg);
                render(ctx!);
            };
        });

        window.addEventListener('keydown', addMoveEvent);
        return () => {
            window.removeEventListener('keydown', addMoveEvent);
        };
    }, [others, user]);

    const drawMyCharacter = (ctx: CanvasRenderingContext2D | null) => {
        if (!ctx) return;
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileWidth);
        const dy = height - (height % tileWidth);
        const myCharacterSrc = imgSrcMap.get(user.email);
        ctx.drawImage(myCharacterSrc!, 0, 0, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);
    };

    const addMoveEvent = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowLeft':
                setUser({
                    uid: user.uid,
                    email: user.email,
                    x: user.x - 1,
                    y: user.y,
                    imageUrl: user.imageUrl,
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
                break;
            case 'ArrowUp':
                setUser({
                    uid: user.uid,
                    email: user.email,
                    x: user.x,
                    y: user.y - 1,
                    imageUrl: user.imageUrl,
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
