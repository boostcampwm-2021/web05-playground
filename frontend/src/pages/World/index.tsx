import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RouteComponentProps } from 'react-router';

import currentWorldState from '../../store/currentWorldState';
import currentModalState from '../../store/currentModalState';

import WorldBackground from '../../components/WorldMap';
import Building from '../../components/Building';
import NavigationBar from '../../components/NavigationBar';
import Modal from '../../components/Modal';
import SetBuildingModal from '../../components/SetBuildingModal';

import worldPark from '../../map-files/world-park.json';
import worldWinter from '../../map-files/world-winter.json';
import selectedBuildingState from '../../store/selectedBuildingState';

interface customWorldInfo {
    [world: string]: typeof worldPark;
}
const worldsInfo: customWorldInfo = {
    world1: worldPark,
    world2: worldWinter,
};

const World = (props: RouteComponentProps) => {
    const [currentWorld, setCurrentWorld] = useRecoilState(currentWorldState);
    const currentModal = useRecoilValue(currentModalState);
    const selectedBuilding = useRecoilValue(selectedBuildingState);

    if (currentWorld.name === 'default') {
        props.history.push('/selectworld');
        return <></>;
    }

    // 기존에는 useState로 관리했는데, 상태변경이 없으면 굳이?? 이유가 있을까
    // 리렌더링 될때만 값을 새로 선언하는게 문제라면 useMemo를 적용해봐도 되지 않을까?
    const [mapLayers, setMapLayer] = useState(worldsInfo[currentWorld.name].layers);

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
    }, []);

    return (
        <>
            {/* 아래 recoil 두 가지 상태에따라 맵이 다시 그려지니까 상태관련된 것은 하위컴포넌트 or 다른 곳으로 빼자 */}
            <WorldBackground data={mapLayers} />
            <Building data={mapLayers} />
            {currentModal !== 'none' ? <Modal /> : <></>}
            <NavigationBar />
            {selectedBuilding.isLocated ? <SetBuildingModal /> : <></>}
        </>
    );
};

export default World;
