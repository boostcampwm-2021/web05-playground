/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { socketClient } from '../../socket/socket';

import userState from '../../store/userState';
import buildBuildingState from '../../store/buildBuildingState';
import buildObjectState from '../../store/buildObjectState';

import { IBuilding, IObject, IProps } from '../../utils/model';
import currentModalState from '../../store/currentModalState';
import {
    COMMON_HEIGHT,
    COMMON_WIDTH,
    DEFAULT_INDEX,
    MIN_HEIGHT,
    MIN_WIDTH,
    NONE,
    TILE_SIZE,
} from '../../utils/constants';

import {
    buildingData,
    objectData,
    buildingListForCharacter,
    objectListForCharacter,
} from '../../utils/variables/buildingData';

const OBJECT = 1;
let ctx: CanvasRenderingContext2D | null;
let checkingCtx: CanvasRenderingContext2D | null;
const itemImageCache = new Map();

const objCanvas = document.createElement('canvas');
const objctx = objCanvas.getContext('2d');
objCanvas.width = COMMON_WIDTH * TILE_SIZE;
objCanvas.height = COMMON_HEIGHT * TILE_SIZE;

let cnt = 0;

const Building = (props: IProps) => {
    const { layers, buildingList, objectList, current: InBuilding } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const checkingRef = useRef<HTMLCanvasElement>(null);
    const [buildBuilding, setBuildBuilding] = useRecoilState(buildBuildingState);
    const [buildObject, setBuildObject] = useRecoilState(buildObjectState);
    const currentModal = useRecoilValue(currentModalState);
    const user = useRecoilValue(userState);

    const obstacleLayer = layers[OBJECT].data;

    let buildTargetX = NONE;
    let buildTargetY = NONE;

    useEffect(() => {
        if (socketClient === undefined) return;
        socketClient.on('buildBuilding', (data: IBuilding) => {
            if (user.isInBuilding === -1) {
                fillItemPosition(data);
                drawOriginItem(data);
            }
        });
        socketClient.on('buildObject', (data: IObject) => {
            const bid = data.bid === 1 ? -1 : data.bid;
            if (bid === user.isInBuilding) {
                fillItemPosition(data);
                drawOriginItem(data);
            }
        });
        return () => {
            socketClient.removeListener('buildBuilding');
            socketClient.removeListener('buildObject');
        };
    }, [socketClient, user, buildingList, objectList]);

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const checkingCanvas: HTMLCanvasElement | null = checkingRef.current;
        if (canvas === null || checkingCanvas === null) {
            return;
        }

        objctx?.clearRect(0, 0, objCanvas.width, objCanvas.height);

        buildingData.fill(0);
        objectData.fill(0);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        checkingCanvas.width = window.innerWidth;
        checkingCanvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
        checkingCtx = checkingCanvas.getContext('2d');

        cnt = 0;

        if (buildingList.length !== 0 && buildingList[DEFAULT_INDEX].id !== -1) {
            buildingList.forEach((building) => {
                fillItemPosition(building);
                drawOriginItem(building);
            });
        }

        if (objectList.length !== 0 && objectList[0].id !== -1) {
            objectList.forEach((object) => {
                fillItemPosition(object);
                drawOriginItem(object);
            });
        }
    }, [buildingList, objectList]);

    useEffect(() => {
        window.addEventListener('mousedown', processBuild);
        window.addEventListener('mousemove', updatePosition);

        return () => {
            window.removeEventListener('mousedown', processBuild);
            window.removeEventListener('mousemove', updatePosition);
        };
    }, [buildBuilding, buildObject]);

    useEffect(() => {
        drawObjCanvas();
        if (buildBuilding.isData || buildObject.isData) {
            checkingCtx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            const DefaultVal = {
                src: 'none',
                id: NONE,
                roomId: NONE,
                locationX: NONE,
                locationY: NONE,
                isLocated: false,
                isData: false,
            };
            buildBuilding.isData ? setBuildBuilding(DefaultVal) : setBuildObject(DefaultVal);
        }
    }, [user]);

    useEffect(() => {
        if (checkingCtx !== null) {
            checkingCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            const DefaultVal = {
                src: 'none',
                id: NONE,
                roomId: NONE,
                locationX: NONE,
                locationY: NONE,
                isLocated: false,
                isData: false,
            };
            setBuildBuilding(DefaultVal);
            setBuildObject(DefaultVal);
        }
    }, [currentModal]);

    // 빌딩 오브젝트 둘 중 하나 처리하는 함수인데 이름은 그냥 빌딩으로 해놨음
    const fillItemPosition = (item: IBuilding | IObject) => {
        const { id, x, y } = item;
        const dataSize = Object.keys(item).includes('uid') ? 2 : 1;

        for (let i = x - dataSize; i < x + dataSize; i++) {
            for (let j = y - dataSize; j < y + dataSize; j++) {
                const index = getIndex(i, j);
                if (dataSize === 1) {
                    objectData[index] = id;
                    objectListForCharacter.set(id, item);
                } else {
                    buildingData[index] = id;
                    buildingListForCharacter.set(id, item);
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

    const isValidPosition = () => {
        return (
            buildTargetX >= MIN_WIDTH &&
            buildTargetX <= window.innerWidth &&
            buildTargetY >= MIN_HEIGHT &&
            buildTargetY <= window.innerHeight
        );
    };

    const processBuild = (e: MouseEvent) => {
        if (e.target != null && (e.target as HTMLElement).tagName === 'IMG') return;

        const flag = currentModal === 'buildBuilding' ? 0 : 1;
        const cur = currentModal === 'buildBuilding' ? buildBuilding : buildObject;
        const { src, isLocated, isData } = cur;

        if (!isData && src !== 'none' && !isLocated) {
            if (flag === 0) {
                setBuildBuilding({
                    ...buildBuilding,
                    isData: true,
                });
                return;
            }
            setBuildObject({
                ...buildObject,
                isData: true,
            });
            return;
        }

        const { layerX, layerY } = getLayerPos();

        if (
            isValidPosition() &&
            isPosssibleArea(buildTargetX + layerX, buildTargetY + layerY) &&
            checkingCtx !== null
        ) {
            const roomId = InBuilding === -1 ? 1 : InBuilding;
            const locationX = buildTargetX + layerX;
            const locationY = buildTargetY + layerY;
            const isLocated = true;
            const isData = false;
            if (flag === 0) {
                setBuildBuilding({
                    ...buildBuilding,
                    roomId,
                    locationX,
                    locationY,
                    isLocated,
                    isData,
                });
            } else {
                setBuildObject({
                    ...buildObject,
                    roomId,
                    locationX,
                    locationY,
                    isLocated,
                    isData,
                });
            }
            checkingCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    };

    const updatePosition = (e: MouseEvent) => {
        const isData = currentModal === 'buildBuilding' ? buildBuilding.isData : buildObject.isData;
        if (!checkingCtx || !isData) return;

        buildTargetX = Math.floor(e.pageX / TILE_SIZE);
        buildTargetY = Math.floor(e.pageY / TILE_SIZE);

        checkingCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        drawItemOfMove();
        drawPossibleBox();
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

    const drawItemOfMove = () => {
        if (!checkingCtx) return;

        const size = currentModal === 'buildBuilding' ? 4 : 2;

        checkingCtx.globalAlpha = 1.0;
        const itemOutputSize = TILE_SIZE * size;

        const src = currentModal === 'buildBuilding' ? buildBuilding.src : buildObject.src;

        const cachingImage = itemImageCache.get(src);

        const sx = buildTargetX * TILE_SIZE - itemOutputSize / 2;
        const sy = buildTargetY * TILE_SIZE - itemOutputSize / 2;
        const dx = itemOutputSize;
        const dy = itemOutputSize;
        if (cachingImage) {
            drawFunction(checkingCtx, cachingImage, sx, sy, dx, dy);
        } else {
            const buildObject = new Image();
            buildObject.src = src;

            buildObject.onload = () => {
                drawFunction(checkingCtx, buildObject, sx, sy, dx, dy);
                itemImageCache.set(src, buildObject);
            };
        }
    };

    const drawPossibleBox = () => {
        if (!checkingCtx) return;

        const size = currentModal === 'buildBuilding' ? 5 : 3;

        const { layerX, layerY } = getLayerPos();

        const possibleAreaOutputSize = TILE_SIZE * size;
        checkingCtx.fillStyle = isPosssibleArea(buildTargetX + layerX, buildTargetY + layerY)
            ? '#C6FCAC'
            : '#F35F5F';
        checkingCtx.globalAlpha = 0.5;
        checkingCtx.fillRect(
            buildTargetX * TILE_SIZE - possibleAreaOutputSize / 2,
            buildTargetY * TILE_SIZE - possibleAreaOutputSize / 2,
            possibleAreaOutputSize,
            possibleAreaOutputSize,
        );
    };

    const getIndex = (x: number, y: number) => {
        return y * COMMON_WIDTH + x;
    };

    const isPosssibleArea = (col: number, row: number) => {
        const halfOfBuildingTileCount = currentModal === 'buildBuilding' ? 2 : 1;
        for (let i = col - halfOfBuildingTileCount; i < col + halfOfBuildingTileCount; i++) {
            for (let j = row - halfOfBuildingTileCount; j < row + halfOfBuildingTileCount; j++) {
                const idx = getIndex(i, j);
                const obstacle = obstacleLayer[idx];
                const objectVal = objectData[idx];
                const buildingVal = buildingData[idx];
                if (obstacle !== 0 || objectVal !== 0 || buildingVal !== 0) {
                    return false;
                }
            }
        }
        return true;
    };

    const drawOriginItem = (item: IBuilding | IObject) => {
        if (!ctx) return;
        if (!objctx) return;

        const dataSize = Object.keys(item).includes('uid') ? 4 : 2;

        const itemOutputSize = TILE_SIZE * dataSize;
        const sx = item.x * TILE_SIZE - itemOutputSize / 2;
        const sy = item.y * TILE_SIZE - itemOutputSize / 2;
        const dx = itemOutputSize;
        const dy = itemOutputSize;

        const worldFlag = buildingList.length > 0 ? -1 : 0;
        const itemsLength = buildingList.length + objectList.length + worldFlag;

        const cachingImage = itemImageCache.get(item.imageUrl);
        if (cachingImage) {
            drawFunction(objctx, cachingImage, sx, sy, dx, dy);
            cnt++;
            if (cnt >= itemsLength) {
                drawObjCanvas();
            }
        } else {
            const buildingObject = new Image();
            buildingObject.src = item.imageUrl;
            buildingObject.onload = () => {
                drawFunction(objctx, buildingObject, sx, sy, dx, dy);
                itemImageCache.set(item.imageUrl, buildingObject);
                cnt++;
                if (cnt >= itemsLength) {
                    drawObjCanvas();
                }
            };
        }
    };

    const drawObjCanvas = () => {
        ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const { layerX, layerY } = getLayerPos();

        const sx = -layerX * TILE_SIZE;
        const sy = -layerY * TILE_SIZE;
        const dx = COMMON_WIDTH * TILE_SIZE;
        const dy = COMMON_HEIGHT * TILE_SIZE;
        drawFunction(ctx, objCanvas, sx, sy, dx, dy);
    };

    return (
        <>
            <BuildingCanvas id="canvas" ref={canvasRef} />
            <CheckingCanvas id="checkingCanvas" ref={checkingRef} />
        </>
    );
};

export default Building;

const BuildingCanvas = styled.canvas`
    position: absolute;
    z-index: 1;
    overflow: hidden;
    display: flex;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
`;
const CheckingCanvas = styled.canvas`
    position: absolute;
    z-index: 2;
    overflow: hidden;
    display: flex;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
`;
