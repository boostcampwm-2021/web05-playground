import React from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import styled from 'styled-components';
import buildBuildingState from '../../../store/buildBuildingState';
import buildingUrls from '../../../store/buildingUrlState';

interface customEventTarget extends EventTarget {
    src: string;
}

interface customMouseEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
    target: customEventTarget;
}

const BuildBuilding = () => {
    const setBuildBuilding = useSetRecoilState(buildBuildingState);
    const buildingUrl = useRecoilValue(buildingUrls);

    const selectBuilding = (e: customMouseEvent) => {
        const selectedBuildingInfo = {
            buildingSrc: e.target.src,
            id: -1,
            locationX: -1,
            locationY: -1,
            isLocated: false,
            isBuilding: true,
        };
        setBuildBuilding(selectedBuildingInfo);
    };

    return (
        <ImgContainer>
            {buildingUrl.map((url) => {
                return (
                    <ImgBtn key={url.url} type="button" onMouseDown={selectBuilding}>
                        <InnerImg src={url.url} alt="빌드 가능한 빌딩 이미지" />
                    </ImgBtn>
                );
            })}
        </ImgContainer>
    );
};

export default BuildBuilding;

const ImgContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
`;

const ImgBtn = styled.button`
    margin: 10px;
    background-color: #c4c4c4;
    border: 0;
`;

const InnerImg = styled.img`
    width: 150px;
    height: 150px;
`;
