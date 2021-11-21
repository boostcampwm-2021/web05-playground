import React from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import styled from 'styled-components';
import buildBuildingState from '../../../store/buildBuildingState';
import buildingUrls from '../../../store/buildingUrlState';
import { NONE } from '../../../utils/constants';
import { Clickable } from '../../../utils/css';
import { ActiveModal } from '../../../utils/model';

interface customEventTarget extends EventTarget {
    src: string;
}

interface customMouseEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
    target: customEventTarget;
}

const BuildBuilding = ({ active }: ActiveModal) => {
    const setBuildBuilding = useSetRecoilState(buildBuildingState);
    const buildingUrl = useRecoilValue(buildingUrls);

    const selectBuilding = (e: customMouseEvent) => {
        e.stopPropagation();
        const selectedBuildingInfo = {
            src: e.target.src,
            id: NONE,
            roomId: NONE,
            locationX: NONE,
            locationY: NONE,
            isLocated: false,
            isData: true,
        };
        setBuildBuilding(selectedBuildingInfo);
    };

    return (
        <ImgContainer active={active}>
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

const ImgContainer = styled.div<ActiveModal>`
    display: ${(props) => (props.active ? 'flex' : 'none')};
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
    ${Clickable}
`;
