/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import buildBuildingState from '../../store/buildBuildingState';

import { IBuilding, IProps } from '../../utils/model';

const commonWidth = 70;
const commonHeight = 50;
const tileSize = 32;
const OBJECT = 1;
let ctx: CanvasRenderingContext2D | null;

const WorldBackground = (props: IProps) => {
    const { layers, buildingList } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [buildBuilding, setBuildBuilding] = useRecoilState(buildBuildingState);
    const [buildingData, setBuildingData] = useState(new Array(commonWidth * commonHeight).fill(0));

    const objectLayer = layers[OBJECT].data;

    let buildTargetX = -1;
    let buildTargetY = -1;

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');

        buildingList.forEach((building) => {
            fillBuildingPosition(building);
            drawOriginBuildings(building);
        });
    }, []);

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

        if (isValidPosition() && isPosssibleArea(buildTargetX, buildTargetY)) {
            setBuildBuilding({
                ...buildBuilding,
                locationX: buildTargetX,
                locationY: buildTargetY,
                isLocated: true,
                isBuilding: false,
            });
        }
    };

    const updatePosition = (e: MouseEvent) => {
        if (!ctx || !buildBuilding.isBuilding) return;

        buildTargetX = Math.floor(e.pageX / tileSize);
        buildTargetY = Math.floor(e.pageY / tileSize);

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawBuildingOfMove();
        drawPossibleBox();
    };

    const drawBuildingOfMove = () => {
        if (!ctx) return;

        ctx.globalAlpha = 1.0;
        const buildingOutputSize = tileSize * 4;
        const buildObject = new Image();
        buildObject.src = buildBuilding.buildingSrc;
        ctx.drawImage(
            buildObject,
            buildTargetX * tileSize - buildingOutputSize / 2,
            buildTargetY * tileSize - buildingOutputSize / 2,
            buildingOutputSize,
            buildingOutputSize,
        );
    };

    const drawPossibleBox = () => {
        if (!ctx) return;

        const possibleAreaOutputSize = tileSize * 5;
        ctx.fillStyle = isPosssibleArea(buildTargetX, buildTargetY) ? '#C6FCAC' : '#F35F5F';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(
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
        buildingObject.src = building.url;

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

    return <BuildingCanvas id="canvas" ref={canvasRef} />;
};

export default WorldBackground;

const BuildingCanvas = styled.canvas`
    position: absolute;
    z-index: 1;
    margin-left: 0px;
    overflow: hidden;
`;
