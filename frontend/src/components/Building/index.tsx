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
import { DEFAULT_INDEX, NONE } from '../../utils/constants';

import {
    buildingData,
    objectData,
    buildingListForCharacter,
} from '../../utils/variables/buildingData';

const commonWidth = 70;
const commonHeight = 50;
const tileSize = 32;
const OBJECT = 1;
let ctx: CanvasRenderingContext2D | null;
let checkingCtx: CanvasRenderingContext2D | null;
const buildingImageCache = new Map();

// const objCanvas = document.createElement('canvas');
// const objctx = objCanvas.getContext('2d');
// objCanvas.width = commonWidth * tileSize;
// objCanvas.height = commonHeight * tileSize;

// 이렇게 전역으로 두니까 모든 월드에 적용되어 버리는듯?... 아닌가
let offscreen: OffscreenCanvas;
let worker: Worker;
let backgroundImage: any;

const Building = (props: IProps) => {
    const { layers, buildingList, objectList, current: InBuilding } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const checkingRef = useRef<HTMLCanvasElement>(null);
    const [buildBuilding, setBuildBuilding] = useRecoilState(buildBuildingState);
    const [buildObject, setBuildObject] = useRecoilState(buildObjectState);
    const currentModal = useRecoilValue(currentModalState);
    const user = useRecoilValue(userState);

    const cnt = 0;

    const obstacleLayer = layers[OBJECT].data;

    let buildTargetX = NONE;
    let buildTargetY = NONE;

    useEffect(() => {
        const canvas: any = canvasRef.current;
        if (canvas === null) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        offscreen = new OffscreenCanvas(window.innerWidth, window.innerHeight);
        worker = new Worker('../../workers/Building/index.ts', {
            type: 'module',
        });

        worker.onmessage = async (e) => {
            const { type, backImage } = e.data;

            // 버퍼에 대한 포인터만 가져옴 => 카피가 안 일어나서 더 효율적
            // 결론 backgroundCanvas의 전체 이미지 카피없이 포인터만으로 굉장히 효율적인 렌더링을 수행할 수 있음
            if (type === 'init') return;
            if (type === 'draw background') {
                backgroundImage = backImage;
                drawObjCanvas();
            }
        };

        worker.postMessage({ type: 'init', offscreen }, [offscreen]);
        return () => {
            // 종료는 여기서 딱한번만 수행!
            worker.postMessage({ type: 'terminate' }, []);
            worker.terminate();
            ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            backgroundImage = null;
            console.log('빌딩워커', '종료');
        };
    }, []);

    useEffect(() => {
        if (socketClient === undefined) return;
        socketClient.on('buildBuilding', (data: IBuilding) => {
            fillBuildingPosition(data);
            // drawOriginBuildings(data);
            // drawObjCanvas();
        });
        socketClient.on('buildObject', (data: IObject) => {
            fillBuildingPosition(data);
            // drawOriginBuildings(data);
            // drawObjCanvas();
        });
        return () => {
            socketClient.removeListener('buildBuilding');
            socketClient.removeListener('buildObject');
        };
    }, [socketClient, user]);

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const checkingCanvas: HTMLCanvasElement | null = checkingRef.current;
        if (canvas === null || checkingCanvas === null) {
            return;
        }

        buildingData.fill(0);
        objectData.fill(0);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        checkingCanvas.width = window.innerWidth;
        checkingCanvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
        checkingCtx = checkingCanvas.getContext('2d');

        let itemList: any = [];
        if (buildingList.length !== 0 && buildingList[DEFAULT_INDEX].id !== -1) {
            buildingList.forEach((building) => {
                fillBuildingPosition(building);
                itemList.push(building);
                // drawOriginBuildings(building);
            });
            // worker.postMessage({ offscreen, buildingList }, [offscreen]);
            // drawObjCanvas();
        }

        if (objectList.length !== 0 && objectList[0].id !== -1) {
            objectList.forEach((object) => {
                fillBuildingPosition(object);
                itemList.push(object);
                // drawOriginBuildings(object);
            });
            drawObjCanvas();
        }

        ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // 오브젝트 리스트(빌등, 오브젝)에 한번에 포함하기 위해 구현중 => 조건문 수정필요
        if (buildingList.length !== 0 && buildingList[DEFAULT_INDEX].id !== -1) {
            itemList = itemList.filter((item: any) => item.imageUrl !== null);
            console.log(itemList);
            worker.postMessage({ type: 'sendItemList', itemList }, []);
        }
    }, [buildingList, objectList, window.innerHeight, window.innerWidth]);

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

    const fillBuildingPosition = (building: IBuilding | IObject) => {
        const { id, x, y } = building;
        const dataSize = Object.keys(building).includes('uid') ? 2 : 1;

        for (let i = x - dataSize; i < x + dataSize; i++) {
            for (let j = y - dataSize; j < y + dataSize; j++) {
                const index = getIndex(i, j);
                if (dataSize === 1) objectData[index] = id;
                else if (id === 1) buildingData[index] = 0;
                else {
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
        let layerX = user.x! - dx / tileSize;
        let layerY = user.y! - dy / tileSize;

        if (layerX < 0) layerX = 0;
        if (layerY < 0) layerY = 0;
        if (layerX > 70) layerX = 70;
        if (layerY > 50) layerY = 50;

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
            // 없어도 될듯??
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

    // const drawOriginBuildings = (building: IBuilding | IObject) => {
    //     if (!ctx) return;
    //     if (!objctx) return;

    //     const dataSize = Object.keys(building).includes('uid') ? 4 : 2;

    //     const buildingOutputSize = tileSize * dataSize;
    //     const sx = building.x * tileSize - buildingOutputSize / 2;
    //     const sy = building.y * tileSize - buildingOutputSize / 2;
    //     const dx = buildingOutputSize;
    //     const dy = buildingOutputSize;

    //     // Todo - 캐싱이미지의 경우 오프스크린에 미리 그려서 캔버스에 입히는 식으로 성능 개선을 해보자
    //     const cachingImage = buildingImageCache.get(building.imageUrl);
    //     if (cachingImage) {
    //         drawFunction(objctx, cachingImage, sx, sy, dx, dy);
    //         cnt++;
    //         if (cnt === buildingList.length) {
    //             drawObjCanvas();
    //         }
    //     } else {
    //         const buildingObject = new Image();
    //         buildingObject.src = building.imageUrl;
    //         buildingObject.onload = () => {
    //             drawFunction(objctx, buildingObject, sx, sy, dx, dy);
    //             buildingImageCache.set(building.imageUrl, buildingObject);
    //             cnt++;
    //             if (cnt === buildingList.length - 1) {
    //                 drawObjCanvas();
    //             }
    //         };
    //     }
    // };

    const drawObjCanvas = () => {
        ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const { layerX, layerY } = getLayerPos();

        const sx = -layerX * tileSize;
        const sy = -layerY * tileSize;
        const dx = window.innerWidth; // commonWidth * tileSize;
        const dy = window.innerHeight; // commonHeight * tileSize;

        if (!backgroundImage) return;
        drawFunction(ctx, backgroundImage, sx, sy, dx, dy);
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
