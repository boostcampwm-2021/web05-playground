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
    }, [characters, user]);

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
                    user.x * characterWidth < dx ? user.x * characterWidth : dx,
                    user.y * characterWidth < dy ? user.y * characterWidth : dy,
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
                newLocation.x -= 1;
                break;
            case 'ArrowRight':
                newLocation.x += 1;
                break;
            case 'ArrowUp':
                newLocation.y -= 1;
                break;
            case 'ArrowDown':
                newLocation.y += 1;
                break;
            default:
                break;
        }

        setUser(newLocation);
        socketClient.emit('move', newLocation);
    };

    return <Canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} />;
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
