import React from 'react';
import { useSetRecoilState } from 'recoil';

import styled from 'styled-components';
import buildBuildingState from '../../../store/buildBuildingState';

interface customEventTarget extends EventTarget {
    src: string;
}

interface customMouseEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
    target: customEventTarget;
}

const BuildBuilding = () => {
    const setBuildBuilding = useSetRecoilState(buildBuildingState);

    const selectBuilding = (e: customMouseEvent) => {
        const selectedBuildingInfo = {
            buildingSrc: e.target.src,
            locationX: -1,
            locationY: -1,
            isLocated: false,
            isBuilding: true,
        };
        setBuildBuilding(selectedBuildingInfo);
    };

    return (
        <button type="button" onMouseDown={selectBuilding}>
            <img src="/assets/home.png" alt="빌드 가능한 빌딩 이미지" />
        </button>
    );
};

export default BuildBuilding;
