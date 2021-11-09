import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { RouteComponentProps } from 'react-router';

import currentWorldState from '../../store/currentWorldState';

import WorldBackground from '../../components/WorldMap';
import NavigationBar from '../../components/NavigationBar';

import worldPark from '../../map-files/world-park.json';
import worldWinter from '../../map-files/world-winter.json';

const worldsInfo: any = {
    world1: worldPark,
    world2: worldWinter,
};

const World = (props: RouteComponentProps) => {
    const [currentWorld, setCurrentWorld] = useRecoilState(currentWorldState);
    if (currentWorld.name === 'default') {
        props.history.push('/selectworld');
        return <></>;
    }

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
            <WorldBackground data={mapLayers} />
            <NavigationBar />
        </>
    );
};

export default World;
