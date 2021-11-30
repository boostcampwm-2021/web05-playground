/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { socketClient } from '../../socket/socket';

import userState from '../../store/userState';
import buildBuildingState from '../../store/buildBuildingState';
import buildObjectState from '../../store/buildObjectState';

import { IBuilding, IObject, IProps } from '../../utils/model';
import currentModalState from '../../store/currentModalState';
import { DEFAULT_INDEX, NONE } from '../../utils/constants';

import {
    buildingData,
    objectData,
    buildingListForCharacter,
    objectListForCharacter,
} from '../../utils/variables/buildingData';

const commonWidth = 70;
const commonHeight = 50;
const tileSize = 32;
const OBJECT = 1;

let checkingCtx: CanvasRenderingContext2D | null;
const buildingImageCache = new Map();

let buildingOffscreen: OffscreenCanvas;
let buildingBgOffscreen: OffscreenCanvas;
let worker: Worker;

const Building = (props: IProps) => {
    const { layers, buildingList, objectList, current: InBuilding, wholeWorker } = props;
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
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        buildingOffscreen = canvas.transferControlToOffscreen();
        buildingBgOffscreen = new OffscreenCanvas(commonWidth * tileSize, commonHeight * tileSize);
    }, []);

    useEffect(() => {
        if (wholeWorker === undefined) return;

        worker = wholeWorker;
        worker.postMessage({ type: 'initBuilding', buildingOffscreen, buildingBgOffscreen }, [
            buildingOffscreen,
            buildingBgOffscreen,
        ]);
    }, [wholeWorker]);

    useEffect(() => {
        if (worker === undefined) return;
        worker.postMessage({ type: 'resetBuildingBgImage' });
    }, [InBuilding]);

    useEffect(() => {
        if (socketClient === undefined) return;

        // 아래 두개 이벤트 통합해도 될듯 6주차에 리팩토링
        socketClient.on('buildBuilding', (data: IBuilding) => {
            fillBuildingPosition(data);
            worker.postMessage({ type: 'buildItem', buildedItem: data }, []);
        });
        socketClient.on('buildObject', (data: IObject) => {
            fillBuildingPosition(data);
            worker.postMessage({ type: 'buildItem', buildedItem: data }, []);
        });
        return () => {
            socketClient.removeListener('buildBuilding');
            socketClient.removeListener('buildObject');
        };
    }, [socketClient, worker]);

    useEffect(() => {
        const checkingCanvas: HTMLCanvasElement | null = checkingRef.current;
        if (checkingCanvas === null) return;

        buildingData.fill(0);
        objectData.fill(0);

        checkingCanvas.width = window.innerWidth;
        checkingCanvas.height = window.innerHeight;

        checkingCtx = checkingCanvas.getContext('2d');

        if (worker === undefined) return;

        let itemList: any = [];
        if (buildingList.length !== 0 && buildingList[DEFAULT_INDEX].id !== -1) {
            buildingList.forEach((building) => {
                fillBuildingPosition(building);
                itemList.push(building);
            });
        }

        if (objectList.length !== 0 && objectList[DEFAULT_INDEX].id !== -1) {
            objectList.forEach((object) => {
                fillBuildingPosition(object);
                itemList.push(object);
            });
        }

        itemList = itemList.filter((item: any) => item.imageUrl !== null);
        if (itemList.length > 0) {
            worker.postMessage({ type: 'sendItemList', itemList, user }, []);
        }
    }, [worker, buildingList, objectList, window.innerHeight, window.innerWidth]);

    useEffect(() => {
        window.addEventListener('mousedown', processBuild);
        window.addEventListener('mousemove', updatePosition);

        return () => {
            window.removeEventListener('mousedown', processBuild);
            window.removeEventListener('mousemove', updatePosition);
        };
    }, [buildBuilding, buildObject]);

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
    const fillBuildingPosition = (building: IBuilding | IObject) => {
        const { id, x, y } = building;
        const dataSize = Object.keys(building).includes('uid') ? 2 : 1;

        for (let i = x - dataSize; i < x + dataSize; i++) {
            for (let j = y - dataSize; j < y + dataSize; j++) {
                const index = getIndex(i, j);
                if (dataSize === 1) {
                    objectData[index] = id;
                    objectListForCharacter.set(id, building);
                } else {
                    buildingData[index] = id;
                    buildingListForCharacter.set(id, building);
                }
            }
        }
    };

    const getLayerPos = () => {
        const width = Math.floor(window.innerWidth / 2);
        const height = Math.floor(window.innerHeight / 2);
        const dx = width - (width % tileSize);
        const dy = height - (height % tileSize);
        const layerX = user.x! - dx / tileSize;
        const layerY = user.y! - dy / tileSize;

        return { layerX, layerY };
    };

    const isValidPosition = () => {
        return (
            buildTargetX >= 0 &&
            buildTargetX <= window.innerWidth &&
            buildTargetY >= 0 &&
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

        buildTargetX = Math.floor(e.pageX / tileSize);
        buildTargetY = Math.floor(e.pageY / tileSize);

        checkingCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        drawBuildingOfMove();
        drawPossibleBox();
    };

    const drawFunction = (ctx: any, img: any, sx: any, sy: any, dx: any, dy: any) => {
        if (!ctx) return;
        ctx.drawImage(img, sx, sy, dx, dy);
    };

    const drawBuildingOfMove = () => {
        if (!checkingCtx) return;

        const size = currentModal === 'buildBuilding' ? 4 : 2;

        checkingCtx.globalAlpha = 1.0;
        const buildingOutputSize = tileSize * size;

        const src = currentModal === 'buildBuilding' ? buildBuilding.src : buildObject.src;

        const cachingImage = buildingImageCache.get(src);

        const sx = buildTargetX * tileSize - buildingOutputSize / 2;
        const sy = buildTargetY * tileSize - buildingOutputSize / 2;
        const dx = buildingOutputSize;
        const dy = buildingOutputSize;
        if (cachingImage) {
            drawFunction(checkingCtx, cachingImage, sx, sy, dx, dy);
        } else {
            const buildObject = new Image();
            buildObject.src = src;

            buildObject.onload = () => {
                drawFunction(checkingCtx, buildObject, sx, sy, dx, dy);
                buildingImageCache.set(src, buildObject);
            };
        }
    };

    const drawPossibleBox = () => {
        if (!checkingCtx) return;

        const size = currentModal === 'buildBuilding' ? 5 : 3;

        const { layerX, layerY } = getLayerPos();

        const possibleAreaOutputSize = tileSize * size;
        checkingCtx.fillStyle = isPosssibleArea(buildTargetX + layerX, buildTargetY + layerY)
            ? '#C6FCAC'
            : '#F35F5F';
        checkingCtx.globalAlpha = 0.5;
        checkingCtx.fillRect(
            buildTargetX * tileSize - possibleAreaOutputSize / 2,
            buildTargetY * tileSize - possibleAreaOutputSize / 2,
            possibleAreaOutputSize,
            possibleAreaOutputSize,
        );
    };

    const getIndex = (x: number, y: number) => {
        return y * commonWidth + x;
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
