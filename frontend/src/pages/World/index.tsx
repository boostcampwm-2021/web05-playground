import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RouteComponentProps } from 'react-router';
import { useQuery } from '@apollo/client';

import styled from 'styled-components';
import currentWorldState from '../../store/currentWorldState';
import buildBuildingState from '../../store/buildBuildingState';
import buildObjectState from '../../store/buildObjectState';
import buildingUrls from '../../store/buildingUrlState';
import objectUrls from '../../store/objectUrlState';

import NavigationBar from '../../components/NavigationBar';
import Modal from '../../components/Modal';
import SetBuildingModal from '../../components/SetBuildingModal';
import SetObjectModal from '../../components/SetObjectModal';

import Background from '../../components/Background';

import worldPark from '../../map-files/world-park.json';
import worldWinter from '../../map-files/world-winter.json';
import buildingInside from '../../map-files/building-inside.json';

import { socketClient, setSocket } from '../../socket/socket';
import { getBuildingAndObjectUrls } from '../../utils/query';
import BuildingInfo from '../../components/Modal/BuildingInfo';
import objectInfoState from '../../store/objectInfoState';
import buildingInfoState from '../../store/buildingInfoState';
import userState from '../../store/userState';
import { NONE } from '../../utils/constants';
import ObjectInfo from '../../components/Modal/ObjectInfo';
import Loading from '../Loading';
import ErrorPage from '../Error';

interface customWorldInfo {
    [world: string]: typeof worldPark;
}
const worldsInfo: customWorldInfo = {
    world1: worldPark,
    world2: worldWinter,
    'test-world': worldPark,
};

const World = (props: RouteComponentProps) => {
    const [currentWorld, setCurrentWorld] = useRecoilState(currentWorldState);
    const [buildingUrl, setBuildingUrl] = useRecoilState(buildingUrls);
    const [objectUrl, setObjectUrl] = useRecoilState(objectUrls);
    const buildBuilding = useRecoilValue(buildBuildingState);
    const buildObject = useRecoilValue(buildObjectState);
    const buildingInfo = useRecoilValue(buildingInfoState);
    const objectInfo = useRecoilValue(objectInfoState);
    const user = useRecoilValue(userState);

    const { loading, error, data } = useQuery(getBuildingAndObjectUrls);

    if (currentWorld.name === 'default') {
        props.history.push('/selectworld');
        return <></>;
    }

    const [mapLayers, setMapLayer] = useState(
        worldsInfo[currentWorld.name] ? worldsInfo[currentWorld.name].layers : worldPark.layers,
    );
    const [buildingLayer, setBuildingLayer] = useState(buildingInside.layers);

    useEffect(() => {
        window.onpopstate = () => {
            setCurrentWorld({
                id: 1,
                uid: 1,
                name: 'default',
                port: 1,
                thumbnail: '/assets/world1',
            });
            props.history.push('/selectworld');
        };

        setSocket(process.env.REACT_APP_BASE_SOCKET_URI!, currentWorld.port);

        return () => {
            socketClient.disconnect();
        };
    }, []);

    useEffect(() => {
        if (data) {
            setBuildingUrl(data.buildingUrl);
            setObjectUrl(data.objectUrl);
        }
    }, [data]);

    if (loading) return <Loading />;
    if (error) return <ErrorPage type={500} />;

    return (
        <Inner>
            {/* 아래 recoil 두 가지 상태에따라 맵이 다시 그려지니까 상태관련된 것은 하위컴포넌트 or 다른 곳으로 빼자 */}
            <Background
                data={user.isInBuilding === NONE ? mapLayers : buildingLayer}
                current={user.isInBuilding}
            />
            {/* 빌딩이면 비디오 컴포넌트 추가 해야함 */}
            {buildingInfo.isBuilding ? <BuildingInfo /> : <></>}
            {objectInfo.isObject ? <ObjectInfo /> : <></>}
            <Modal />
            <NavigationBar props={props} />
            {buildBuilding.isLocated ? <SetBuildingModal /> : <></>}
            {buildObject.isLocated ? <SetObjectModal /> : <></>}
        </Inner>
    );
};

const Inner = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #d1daa5;
`;

export default World;
