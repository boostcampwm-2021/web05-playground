/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { socketClient } from '../../socket/socket';

import buildBuildingState from '../../store/buildBuildingState';

import { IBuilding, IProps } from '../../utils/model';

const commonWidth = 70;
const commonHeight = 50;
const tileSize = 32;
const OBJECT = 1;
let ctx: CanvasRenderingContext2D | null;
let checkingCtx: CanvasRenderingContext2D | null;

const Building = (props: IProps) => {
    const { layers, buildingList } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const checkingRef = useRef<HTMLCanvasElement>(null);
    const [buildBuilding, setBuildBuilding] = useRecoilState(buildBuildingState);
    const [buildingData, setBuildingData] = useState(new Array(commonWidth * commonHeight).fill(0));

    const objectLayer = layers[OBJECT].data;

    let buildTargetX = -1;
    let buildTargetY = -1;

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const checkingCanvas: HTMLCanvasElement | null = checkingRef.current;
        if (canvas === null || checkingCanvas === null) {
            return;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        checkingCanvas.width = window.innerWidth;
        checkingCanvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
        checkingCtx = checkingCanvas.getContext('2d');

        buildingList.forEach((building) => {
            fillBuildingPosition(building);
            drawOriginBuildings(building);
        });

        if (socketClient === undefined) return;
        socketClient.on('buildBuilding', (data: IBuilding) => {
            drawOriginBuildings(data);
        });

        return () => {
            socketClient.removeListener('buildBuilding');
        };
    }, [buildingList]);

    useEffect(() => {
        window.addEventListener('mousedown', processBuild);
        window.addEventListener('mousemove', updatePosition);

        return () => {
            window.removeEventListener('mousedown', processBuild);
            window.removeEventListener('mousemove', updatePosition);
        };
    }, [buildBuilding]);

    const fillBuildingPosition = (building: IBuilding) => {
        const { x, y } = building;
        const buildingSize = 4;
        for (let i = x; i < x + buildingSize; i++) {
            for (let j = y; j < y + buildingSize; j++) {
                const index = getIndex(i, j);
                buildingData[index] = 1;
            }
        }
    };

    const isValidPosition = () => {
        return (
            buildTargetX >= 0 &&
            buildTargetX <= window.innerWidth &&
            buildTargetY >= 0 &&
            buildTargetY <= window.innerHeight
        );
    };

    const processBuild = () => {
        if (
            !buildBuilding.isBuilding &&
            buildBuilding.buildingSrc !== 'none' &&
            !buildBuilding.isLocated
        ) {
            setBuildBuilding({
                ...buildBuilding,
                isBuilding: true,
            });
            return;
        }

        if (
            isValidPosition() &&
            isPosssibleArea(buildTargetX, buildTargetY) &&
            checkingCtx !== null
        ) {
            setBuildBuilding({
                ...buildBuilding,
                locationX: buildTargetX,
                locationY: buildTargetY,
                isLocated: true,
                isBuilding: false,
            });
            checkingCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    };

    const updatePosition = (e: MouseEvent) => {
        if (!checkingCtx || !buildBuilding.isBuilding) return;

        buildTargetX = Math.floor(e.pageX / tileSize);
        buildTargetY = Math.floor(e.pageY / tileSize);

        checkingCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        drawBuildingOfMove();
        drawPossibleBox();
    };

    const drawBuildingOfMove = () => {
        if (!checkingCtx) return;

        checkingCtx.globalAlpha = 1.0;
        const buildingOutputSize = tileSize * 4;
        const buildObject = new Image();
        buildObject.src = buildBuilding.buildingSrc;
        checkingCtx.drawImage(
            buildObject,
            buildTargetX * tileSize - buildingOutputSize / 2,
            buildTargetY * tileSize - buildingOutputSize / 2,
            buildingOutputSize,
            buildingOutputSize,
        );
    };

    const drawPossibleBox = () => {
        if (!checkingCtx) return;

        const possibleAreaOutputSize = tileSize * 5;
        checkingCtx.fillStyle = isPosssibleArea(buildTargetX, buildTargetY) ? '#C6FCAC' : '#F35F5F';
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
        const halfOfBuildingTileCount = 2;
        for (let i = col - halfOfBuildingTileCount; i < col + halfOfBuildingTileCount; i++) {
            for (let j = row - halfOfBuildingTileCount; j < row + halfOfBuildingTileCount; j++) {
                const objectVal = objectLayer[getIndex(i, j)];
                const buildingVal = buildingData[getIndex(i, j)];
                if (objectVal !== 0 || buildingVal !== 0) {
                    return false;
                }
            }
        }
        return true;
    };

    const drawOriginBuildings = (building: IBuilding) => {
        if (!ctx) return;

        const buildingObject = new Image();
        buildingObject.src = building.imageUrl;
        buildingObject.onload = () => {
            if (!ctx) return;
            const buildingOutputSize = tileSize * 4;
            ctx.drawImage(
                buildingObject,
                building.x * tileSize - buildingOutputSize / 2,
                building.y * tileSize - buildingOutputSize / 2,
                buildingOutputSize,
                buildingOutputSize,
            );
        };
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
    margin-left: 0px;
    overflow: hidden;
`;

const CheckingCanvas = styled.canvas`
    position: absolute;
    z-index: 2;
    margin-left: 0px;
    overflow: hidden;
`;
