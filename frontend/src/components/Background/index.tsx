/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-absolute-path */
/* eslint-disable no-plusplus */
import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import userState from '../../store/userState';

import Building from '../../components/Building';
import { socketClient } from '../../socket/socket';
import { IBuildingInfo, UserMap } from '../../utils/model';
import { Character } from '../Character';
import Video from '../Video';
import allUserListState from '../../store/allUserListState';

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

let offscreen: any;
let worker: Worker;
const WorldBackground = (props: IProps) => {
    const layers = props.data;
    const InBuilding = props.current;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const user = useRecoilValue(userState);
    const [allUser, setAllUser] = useRecoilState(allUserListState);

    const [buildingInfo, setBuildingInfo] = useState({
        buildings: [
            {
                id: -1,
                x: 3,
                y: 3,
                uid: 1,
                description: '테스트1',
                scope: 'private',
                password: '1234',
                imageUrl: 'http://localhost:3000/assets/home.png',
            },
        ],
        objects: [
            {
                id: -1,
                bid: -1,
                x: 3,
                y: 3,
                imageUrl: 'http://localhost:3000/assets/home.png',
                fileUrl: '',
            },
        ],
    });

    useEffect(() => {
        const canvas: any = canvasRef.current;
        if (canvas === null) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        offscreen = canvas.transferControlToOffscreen();
        worker = new Worker('../../workers/Background/index.ts', {
            type: 'module',
        });

        worker.onmessage = async (e) => {
            const { msg } = e.data;
        };

        worker.postMessage({ type: 'init', offscreen }, [offscreen]);
        return () => {
            worker.postMessage({ type: 'terminate' }, []);
            worker.terminate();
        };
    }, []);

    useEffect(() => {
        const enterInfo = {
            user,
            roomId: InBuilding,
        };
        socketClient.emit('enter', enterInfo);

        socketClient.on('enter', (data: IBuildingInfo) => {
            setBuildingInfo(data);
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
        worker.postMessage({ type: 'sendLayer', layers, user }, []);
    }, [layers]);

    useEffect(() => {
        if (worker === undefined) return;
        worker.postMessage({ type: 'update', layers, user }, []);
    }, [user, worker, window.innerWidth, window.innerHeight]);

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
