/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import selectedBuildingState from '../../store/selectedBuildingState';

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
    const [selectedBuilding, setSelectedBuilding] = useRecoilState(selectedBuildingState);

    const tileSize = 32;
    const OBJECT = 1;

    const objectLayer = layers[OBJECT].data;

    let ctx: CanvasRenderingContext2D | null;

    const commonWidth = 70;
    const commonHeight = 50;

    // 0으로 초기화 및 기존에 건설된 건물 정보 포함
    // 건물을 불러와서 초기 데이터 넣을때는 로딩 페이지가 필요
    const buildingData = new Array(commonWidth * commonHeight).fill(0);

    let isBuilding = false;
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
    }, [selectedBuilding]);

    const processBuild = () => {
        if (isBuilding || selectedBuilding.buildingSrc === 'none') return;
        isBuilding = !isBuilding;

        setSelectedBuilding({
            ...selectedBuilding,
            locationX: buildTargetX,
            locationY: buildTargetY,
            isLocated: true,
        });
    };

    const updatePosition = (e: MouseEvent) => {
        buildTargetX = Math.floor(e.pageX / tileSize);
        buildTargetY = Math.floor(e.pageY / tileSize);

        if (!ctx || selectedBuilding.buildingSrc === 'none' || selectedBuilding.isLocated) return;
        const buildObject = new Image();
        buildObject.src = selectedBuilding.buildingSrc;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (isPosssibleArea(buildTargetX, buildTargetY)) {
            drawBuilding();
        }

        ctx.drawImage(
            buildObject,
            buildTargetX * tileSize - tileSize * 2,
            buildTargetY * tileSize - tileSize * 2,
            tileSize * 4,
            tileSize * 4,
        );
    };

    const drawBuilding = () => {
        if (!ctx) return;
        ctx.fillStyle = '#C6FCAC';
        ctx.fillRect(
            buildTargetX * tileSize - tileSize * 2.5,
            buildTargetY * tileSize - tileSize * 2.5,
            tileSize * 5,
            tileSize * 5,
        );
    };

    const getIndex = (x: number, y: number) => {
        return y * commonWidth + x;
    };

    const isPosssibleArea = (col: number, row: number) => {
        for (let i = col - 2; i < col + 2; i++) {
            for (let j = row - 2; j < row + 2; j++) {
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
