/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-absolute-path */
/* eslint-disable no-plusplus */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import userState from '../../store/userState';

import Building from '../../components/Building';
import { socketClient } from '../../socket/socket';
import { IBuildingInfo, UserMap } from '../../utils/model';
import { Character } from '../Character';
import Video from '../Video';
import allUserListState from '../../store/allUserListState';
import currentModalState from '../../store/currentModalState';
import {
    COMMON_HEIGHT,
    COMMON_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH,
    NONE,
    TILE_SIZE,
} from '../../utils/constants';

interface ILayer {
    data: number[];
    height: number;
    width: number;
    imgSrc: string;
    columnCount: number;
    layerType: string;
}

interface IProps {
    data: ILayer[];
    current: number;
}

let ctx: CanvasRenderingContext2D | null;

const backgroundCanvas = new OffscreenCanvas(COMMON_WIDTH * TILE_SIZE, COMMON_HEIGHT * TILE_SIZE);
const backgroundCtx = backgroundCanvas.getContext('2d');

const backgroundImageCache = new Map();

const WorldBackground = (props: IProps) => {
    const layers = props.data;
    const InBuilding = props.current;
    const layersType = layers[0].layerType;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tileBackground, setTileBackground] = useState<HTMLImageElement[]>();
    const user = useRecoilValue(userState);
    const setAllUser = useSetRecoilState(allUserListState);
    const setCurrentModal = useSetRecoilState(currentModalState);

    const [buildingInfo, setBuildingInfo] = useState({
        buildings: [
            {
                id: NONE,
                x: 3,
                y: 3,
                uid: 1,
                description: '',
                scope: 'private',
                password: '1234',
                imageUrl: '',
            },
        ],
        objects: [
            {
                id: NONE,
                bid: NONE,
                x: 3,
                y: 3,
                imageUrl: '',
                fileUrl: '',
            },
        ],
    });

    let sourceX = 0;
    let sourceY = 0;

    const getIndex = (x: number, y: number) => {
        if (x < 0) return -1;
        return y * COMMON_WIDTH + x;
    };

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
    }, []);

    useEffect(() => {
        const enterInfo = {
            user,
            roomId: InBuilding,
        };
        socketClient.emit('enter', enterInfo);

        socketClient.on('enter', (data: IBuildingInfo) => {
            setBuildingInfo(data);
            setCurrentModal('none');
        });
        socketClient.on('allUserList', (data: UserMap) => {
            setAllUser(data);
        });

        return () => {
            socketClient.removeListener('enter');
            socketClient.removeListener('allUserList');
        };
    }, [socketClient, InBuilding]);

    useEffect(() => {
        backgroundCtx?.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        const cachingImage = backgroundImageCache.get(layersType);

        if (cachingImage) {
            drawObjCanvas();
            return;
        }

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
    }, [layers]);

    useEffect(() => {
        drawGame();
        drawObjCanvas();
    }, [tileBackground]);

    useEffect(() => {
        drawObjCanvas();
    }, [user, window.innerWidth, window.innerHeight]);

    const drawGame = () => {
        if (!backgroundCtx || !tileBackground) return;

        layers.forEach((layer) => {
            const indexOfLayers = layers.indexOf(layer);
            drawBackground(layer, indexOfLayers);
        });

        const bgImageBitmap = backgroundCanvas.transferToImageBitmap();
        backgroundImageCache.set(layersType, bgImageBitmap);
    };

    const drawBackground = (layer: ILayer, indexOfLayers: number) => {
        if (!backgroundCtx || !tileBackground) return;

        for (let col = MIN_HEIGHT; col < COMMON_HEIGHT; ++col) {
            for (let row = MIN_WIDTH; row < COMMON_WIDTH; ++row) {
                let tileVal = layer.data[getIndex(row, col)];
                if (tileVal !== 0) {
                    tileVal -= 1;
                    sourceY = Math.floor(tileVal / layer.columnCount) * TILE_SIZE;
                    sourceX = (tileVal % layer.columnCount) * TILE_SIZE;
                    backgroundCtx.drawImage(
                        tileBackground[indexOfLayers],
                        sourceX,
                        sourceY,
                        TILE_SIZE,
                        TILE_SIZE,
                        row * TILE_SIZE,
                        col * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE,
                    );
                }
            }
        }
    };

    const getLayerPos = () => {
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % TILE_SIZE);
        const dy = height - (height % TILE_SIZE);
        const layerX = user.x! - dx / TILE_SIZE;
        const layerY = user.y! - dy / TILE_SIZE;

        return { layerX, layerY };
    };

    const drawObjCanvas = () => {
        ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const { layerX, layerY } = getLayerPos();

        const sx = -layerX * TILE_SIZE;
        const sy = -layerY * TILE_SIZE;
        const dx = COMMON_WIDTH * TILE_SIZE;
        const dy = COMMON_HEIGHT * TILE_SIZE;

        const cachingImage = backgroundImageCache.get(layersType);
        if (cachingImage) {
            drawFunction(ctx, cachingImage, sx, sy, dx, dy);
        }
    };

    const drawFunction = (
        ctx: CanvasRenderingContext2D | null,
        img: HTMLCanvasElement | HTMLImageElement,
        sx: number,
        sy: number,
        dx: number,
        dy: number,
    ) => {
        if (!ctx) return;
        ctx.drawImage(img, sx, sy, dx, dy);
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
