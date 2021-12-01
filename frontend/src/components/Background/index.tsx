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
}

interface IProps {
    data: ILayer[];
    current: number;
}

interface IEnter {
    user: string;
    roomId: number;
}

const WorldBackground = (props: IProps) => {
    const layers = props.data;
    const InBuilding = props.current;
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

    let ctx: CanvasRenderingContext2D | null;
    let sourceX = 0;
    let sourceY = 0;

    const getIndex = (x: number, y: number) => {
        if (x < 0) return -1;
        return y * COMMON_WIDTH + x;
    };

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
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (canvas === null) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
        drawGame();
    }, [tileBackground, user, window.innerWidth, window.innerHeight]);

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
        const dx = width - (width % TILE_SIZE);
        const dy = height - (height % TILE_SIZE);
        const layerX = user.x! - dx / TILE_SIZE;
        const layerY = user.y! - dy / TILE_SIZE;

        if (!ctx || !tileBackground) return;

        let colEnd = layer.height + layerY;
        let rowEnd = layer.width + layerX;

        if (colEnd < MIN_HEIGHT) colEnd = MIN_HEIGHT;
        if (rowEnd < MIN_WIDTH) rowEnd = MIN_WIDTH;
        if (colEnd > COMMON_HEIGHT) colEnd = COMMON_HEIGHT;
        if (rowEnd > COMMON_WIDTH) rowEnd = COMMON_WIDTH;

        if (layerY === colEnd && layerX === rowEnd) return;

        for (let col = layerY; col < colEnd; ++col) {
            for (let row = layerX; row < rowEnd; ++row) {
                let tileVal = layer.data[getIndex(row, col)];
                if (tileVal !== 0) {
                    tileVal -= 1;
                    sourceY = Math.floor(tileVal / layer.columnCount) * TILE_SIZE;
                    sourceX = (tileVal % layer.columnCount) * TILE_SIZE;
                    ctx.drawImage(
                        tileBackground[indexOfLayers],
                        sourceX,
                        sourceY,
                        TILE_SIZE,
                        TILE_SIZE,
                        (row - layerX) * TILE_SIZE,
                        (col - layerY) * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE,
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
