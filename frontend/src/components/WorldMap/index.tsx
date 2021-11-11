/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-absolute-path */
/* eslint-disable no-plusplus */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import userState from '../../store/userState';

interface ILayer {
    data: number[];
    height: number;
    width: number;
    imgSrc: string;
    columnCount: number;
}

interface IProps {
    data: ILayer[];
}

interface IUser {
    id: number;
    email: string;
    nickname: string;
    x: number;
    y: number;
    imageurl: string;
}

const WorldBackground = (props: IProps) => {
    const layers = props.data;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tileBackground, setTileBackground] = useState<HTMLImageElement[]>();
    const user = useRecoilValue(userState);
    const commonWidth = layers[0].width;
    const tileSize = 32;

    let ctx: CanvasRenderingContext2D | null;
    let sourceX = 0;
    let sourceY = 0;

    const spriteTileSize = 32;

    const getIndex = (x: number, y: number) => {
        return y * commonWidth + x;
    };

    useEffect(() => {
        const backgroundImageList: HTMLImageElement[] = [];
        let cnt = 0;
        layers.forEach((layer) => {
            const backgroundImg = new Image();
            backgroundImg.src = layer.imgSrc;
            backgroundImg.onload = () => {
                cnt++;
                backgroundImageList.push(backgroundImg);
                if (cnt === layers.length) {
                    setTileBackground([...backgroundImageList]);
                }
            };
        });
    }, []);

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
        drawGame();
    }, [tileBackground, user, window.innerWidth, window.innerHeight]);

    const drawGame = () => {
        if (!ctx || !tileBackground) return;

        layers.forEach((layer) => {
            const indexOfLayers = layers.indexOf(layer);
            drawBackground(layer, indexOfLayers);
        });
    };

    const drawBackground = (layer: ILayer, indexOfLayers: number) => {
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileSize);
        const dy = height - (height % tileSize);
        const layerX = user.x - dx / tileSize;
        const layerY = user.y - dy / tileSize;

        if (!ctx || !tileBackground) return;

        for (let col = layerY; col < layer.height + layerY; ++col) {
            for (let row = layerX; row < layer.width + layerX; ++row) {
                let tileVal = layer.data[getIndex(row % layer.width, col % layer.height)];
                if (tileVal !== 0) {
                    tileVal -= 1;
                    sourceY = Math.floor(tileVal / layer.columnCount) * spriteTileSize;
                    sourceX = (tileVal % layer.columnCount) * spriteTileSize;
                    ctx.drawImage(
                        tileBackground[indexOfLayers],
                        sourceX,
                        sourceY,
                        spriteTileSize,
                        spriteTileSize,
                        (row - layerX) * tileSize,
                        (col - layerY) * tileSize,
                        tileSize,
                        tileSize,
                    );
                }
            }
        }
    };

    return <Canvas id="canvas" ref={canvasRef} />;
};

export default WorldBackground;

const Canvas = styled.canvas`
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
`;
