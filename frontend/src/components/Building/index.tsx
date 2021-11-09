/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import buildBuildingState from '../../store/buildBuildingState';

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

const WorldBackground = (props: IProps) => {
    const layers = props.data;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [buildBuilding, setBuildBuilding] = useRecoilState(buildBuildingState);

    const tileSize = 32;
    const OBJECT = 1;

    const objectLayer = layers[OBJECT].data;

    let ctx: CanvasRenderingContext2D | null;

    const commonWidth = 70;
    const commonHeight = 50;

    // 0으로 초기화 및 기존에 건설된 건물 정보 포함
    // 건물을 불러와서 초기 데이터 넣을때는 로딩 페이지가 필요
    const buildingData = new Array(commonWidth * commonHeight).fill(0);

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

        window.addEventListener('mousedown', processBuild);
        window.addEventListener('mousemove', updatePosition);

        return () => {
            window.removeEventListener('mousedown', processBuild);
            window.removeEventListener('mousemove', updatePosition);
        };
    }, [buildBuilding]);

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

        const buildObject = new Image();
        buildObject.src = buildBuilding.buildingSrc;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (isPosssibleArea(buildTargetX, buildTargetY)) {
            drawBuilding();
        }

        const buildingOutputSize = tileSize * 4;
        ctx.drawImage(
            buildObject,
            buildTargetX * tileSize - buildingOutputSize / 2,
            buildTargetY * tileSize - buildingOutputSize / 2,
            buildingOutputSize,
            buildingOutputSize,
        );
    };

    const drawBuilding = () => {
        if (!ctx) return;
        const possibleAreaOutputSize = tileSize * 5;
        ctx.fillStyle = '#C6FCAC';
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

    return <BuildingCanvas id="canvas" ref={canvasRef} />;
};

export default WorldBackground;

const BuildingCanvas = styled.canvas`
    position: absolute;
    z-index: 1;
    margin-left: 0px;
    overflow: hidden;
`;
