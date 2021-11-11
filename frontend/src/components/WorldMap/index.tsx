/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-absolute-path */
/* eslint-disable no-plusplus */
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import { socketClient } from '../../socket/socket';

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
    }, [socketClient]);

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
        drawGame();
    }, [tileBackground]);

    const drawGame = () => {
        if (!ctx || !tileBackground) return;

        layers.forEach((layer) => {
            const indexOfLayers = layers.indexOf(layer);
            drawBackground(layer, indexOfLayers);
        });
    };

    const drawBackground = (layer: ILayer, indexOfLayers: number) => {
        if (!ctx || !tileBackground) return;
        for (let col = 0; col < layer.height; ++col) {
            for (let row = 0; row < layer.width; ++row) {
                let tileVal = layer.data[getIndex(row, col)];
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
                        row * tileSize,
                        col * tileSize,
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
    position: fixed;
    margin-left: 0px;
    overflow: hidden;
`;
