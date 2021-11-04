import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import currentWorldState from '../../store/currentWorldState';

import WorldBackground from '../../components/WorldMap';

import worldPark from '../../map-files/world-park.json';
import worldWinter from '../../map-files/world-winter.json';

const worldsInfo: any = {
    world1: worldPark,
    world2: worldWinter,
};

const World = () => {
    const currentWorld = useRecoilValue(currentWorldState);
    const [mapLayers, setMapLayer] = useState<any>(
        worldsInfo[currentWorld.name].layers,
    );

    useEffect(() => {
        setMapLayer(worldsInfo[currentWorld.name].layers);
    }, [currentWorld]);

    return <WorldBackground data={mapLayers} key={currentWorld.wid} />;
};

export default World;
