/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-absolute-path */
/* eslint-disable no-plusplus */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import userState from '../../store/userState';

import Building from '../../components/Building';
import { socketClient } from '../../socket/socket';
import { IBuildingInfo } from '../../utils/model';
import { Character } from '../Character';
import Video from '../Video';

interface ILayer {
    data: number[];
    height: number;
    width: number;
    imgSrc: string;
    columnCount: number;
}

interface IProps {
    data: ILayer[];
    current: number;
}

interface IEnter {
    user: string;
    roomId: number;
}

let worker: Worker;
const WorldBackground = (props: IProps) => {
    const layers = props.data;
    const InBuilding = props.current;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tileBackground, setTileBackground] = useState<HTMLImageElement[]>();
    const user = useRecoilValue(userState);
    const commonWidth = layers[0].width;
    const tileSize = 32;

    // let worker: Worker;

    const [buildingInfo, setBuildingInfo] = useState({
        buildings: [
            {
                id: -1,
                x: 3,
                y: 3,
                uid: 1,
                description: '테스트1',
                scope: 'private',
                password: '1234',
                imageUrl: 'http://localhost:3000/assets/home.png',
            },
        ],
        objects: [
            {
                id: -1,
                bid: -1,
                x: 3,
                y: 3,
                imageUrl: 'http://localhost:3000/assets/home.png',
                fileUrl: '',
            },
        ],
    });

    let ctx: CanvasRenderingContext2D | null;
    let sourceX = 0;
    let sourceY = 0;

    const spriteTileSize = 32;

    const getIndex = (x: number, y: number) => {
        return y * commonWidth + x;
    };

    useEffect(() => {
        const enterInfo = {
            user: user.nickname,
            roomId: InBuilding,
        };
        socketClient.emit('enter', enterInfo);

        socketClient.on('enter', (data: IBuildingInfo) => {
            setBuildingInfo(data);
        });

        return () => {
            socketClient.removeListener('enter');
        };
    }, [socketClient, InBuilding]);

    useEffect(() => {
        // const backgroundImageList: HTMLImageElement[] = [];
        // let cnt = 0;
        // layers.forEach((layer) => {
        //     const backgroundImg = new Image();
        //     backgroundImg.src = layer.imgSrc;
        //     backgroundImg.onload = () => {
        //         cnt++;
        //         backgroundImageList.push(backgroundImg);
        //         if (cnt === layers.length) {
        //             setTileBackground([...backgroundImageList]);
        //         }
        //     };
        // });

        const canvas: any = canvasRef.current;
        if (canvas === null) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const offscreen = canvas.transferControlToOffscreen();
        worker = new Worker('../../workers/Background/index.ts', {
            type: 'module',
        });

        worker.onmessage = async (e) => {
            const { msg } = e.data;

            if (msg) console.log(msg);
        };

        worker.postMessage({ type: 'init', offscreen, layers, user }, [offscreen]);

        return () => {
            worker.terminate();
        };
    }, [layers]);

    useEffect(() => {
        // const canvas: HTMLCanvasElement | null = canvasRef.current;
        // if (canvas === null) {
        //     return;
        // }
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        // ctx = canvas.getContext('2d');
        // drawGame();

        if (worker === undefined) return;
        worker.postMessage({ type: 'update', layers, user }, []);
    }, [user, worker, window.innerWidth, window.innerHeight]);

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
        let layerX = user.x! - dx / tileSize;
        let layerY = user.y! - dy / tileSize;

        if (!ctx || !tileBackground) return;

        if (layerX < 0) layerX = 0;
        if (layerY < 0) layerY = 0;
        if (layerX > 70) layerX = 70;
        if (layerY > 50) layerY = 50;

        let colEnd = layer.height + layerY;
        let rowEnd = layer.width + layerX;

        if (colEnd > 50) colEnd = 50;
        if (rowEnd > 70) rowEnd = 70;

        if (layerY === colEnd && layerX === rowEnd) return;

        for (let col = layerY; col < colEnd; ++col) {
            for (let row = layerX; row < rowEnd; ++row) {
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
                        (row - layerX) * tileSize,
                        (col - layerY) * tileSize,
                        tileSize,
                        tileSize,
                    );
                }
            }
        }
    };

    return (
        <>
            <Canvas id="bgCanvas" ref={canvasRef} />
            {InBuilding === -1 ? null : <Video />}
            <Building
                layers={layers}
                buildingList={buildingInfo.buildings}
                objectList={buildingInfo.objects}
                current={InBuilding}
            />
            <Character />
        </>
    );
};

export default WorldBackground;

const Canvas = styled.canvas`
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
`;
