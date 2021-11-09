/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

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
    const tileSize = 32;

    const OBJECT = 1;

    // 기존에는 useState로 관리했는데, 상태변경이 없으면 굳이?? 이유가 있을까
    // 리렌더링 될때만 값을 새로 선언하는게 문제라면 useMemo를 적용해봐도 되지 않을까?
    const objectLayer = layers[OBJECT].data;

    let ctx: CanvasRenderingContext2D | null;

    const commonWidth = 70;
    const commonHeight = 50;

    // 0으로 초기화 및 기존에 건설된 건물 정보 포함
    // 건물을 불러와서 초기 데이터 넣을때는 로딩 페이지가 필요
    const buildingData = new Array(commonWidth * commonHeight).fill(0);

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');

        // clear 먼저 하고 그리는 방식을 생각하자
        // 지금은 계속 위에 쌓고있다.
        drawPossibleBuildArea();
    }, []);

    const getIndex = (x: number, y: number) => {
        return y * commonWidth + x;
    };

    const isPosssibleArea = (col: number, row: number) => {
        for (let i = col; i < col + 2; i++) {
            for (let j = row; j < row + 2; j++) {
                const objectVal = objectLayer[getIndex(i, j)];
                const buildingVal = buildingData[getIndex(i, j)];
                if (objectVal !== 0 || buildingVal !== 0) {
                    return false;
                }
            }
        }
        return true;
    };

    const drawPossibleBuildArea = () => {
        if (!ctx) return;
        ctx.fillStyle = '#C6FCAC';
        for (let col = 1; col < window.innerHeight; col += 3) {
            for (let row = 1; row < window.innerWidth; row += 3) {
                if (isPosssibleArea(col, row)) {
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize * 2, tileSize * 2);
                }
            }
        }
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
