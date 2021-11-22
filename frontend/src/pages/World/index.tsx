import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RouteComponentProps } from 'react-router';
import { useQuery } from '@apollo/client';

import currentWorldState from '../../store/currentWorldState';
import currentModalState from '../../store/currentModalState';
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
import BuildingInfo from '../../components/BuildingInfo';
import buildingInfoState from '../../store/buildingInfoState';
import isInBuildingState from '../../store/isInBuildingState';
import { NONE } from '../../utils/constants';

interface customWorldInfo {
    [world: string]: typeof worldPark;
}
const worldsInfo: customWorldInfo = {
    world1: worldPark,
    world2: worldWinter,
};

const World = (props: RouteComponentProps) => {
    const [currentWorld, setCurrentWorld] = useRecoilState(currentWorldState);
    const [buildingUrl, setBuildingUrl] = useRecoilState(buildingUrls);
    const [objectUrl, setObjectUrl] = useRecoilState(objectUrls);
    const currentModal = useRecoilValue(currentModalState);
    const buildBuilding = useRecoilValue(buildBuildingState);
    const buildObject = useRecoilValue(buildObjectState);
    const buildingInfo = useRecoilValue(buildingInfoState);
    const isInBuilding = useRecoilValue(isInBuildingState);

    const { loading, error, data } = useQuery(getBuildingAndObjectUrls);

    if (currentWorld.name === 'default') {
        props.history.push('/selectworld');
        return <></>;
    }

    // 기존에는 useState로 관리했는데, 상태변경이 없으면 굳이?? 이유가 있을까
    // 리렌더링 될때만 값을 새로 선언하는게 문제라면 useMemo를 적용해봐도 되지 않을까?
    const [mapLayers, setMapLayer] = useState(worldsInfo[currentWorld.name].layers);
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

        setSocket(
            process.env.REACT_APP_BASE_SOCKET_URI!.concat(`:${currentWorld.port.toString()}`),
        );

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            {/* 아래 recoil 두 가지 상태에따라 맵이 다시 그려지니까 상태관련된 것은 하위컴포넌트 or 다른 곳으로 빼자 */}
            <>
                <Background
                    data={isInBuilding === NONE ? mapLayers : buildingLayer}
                    current={isInBuilding}
                />
            </>
            {/* 빌딩이면 비디오 컴포넌트 추가 해야함 */}
            {buildingInfo.isBuilding ? <BuildingInfo /> : <></>}
            {currentModal !== 'none' ? <Modal /> : <></>}
            <NavigationBar props={props} />
            {buildBuilding.isLocated ? <SetBuildingModal /> : <></>}
            {buildObject.isLocated ? <SetObjectModal /> : <></>}
        </>
    );
};

export default World;
