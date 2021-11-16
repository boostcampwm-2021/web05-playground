import React from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import styled from 'styled-components';
import buildObjectState from '../../../store/buildObjectState';
import objectUrls from '../../../store/objectUrlState';

interface customEventTarget extends EventTarget {
    src: string;
}

interface customMouseEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
    target: customEventTarget;
}

const BuildObject = () => {
    const setBuildObject = useSetRecoilState(buildObjectState);
    const objectUrl = useRecoilValue(objectUrls);

    const selectObject = (e: customMouseEvent) => {
        e.stopPropagation();
        const selectedObjectInfo = {
            src: e.target.src,
            id: -1,
            locationX: -1,
            locationY: -1,
            isLocated: false,
            isData: true,
        };
        setBuildObject(selectedObjectInfo);
    };

    return (
        <ImgContainer>
            {objectUrl.map((url) => {
                return (
                    <ImgBtn key={url.url} type="button" onMouseDown={selectObject}>
                        <InnerImg src={url.url} alt="빌드 가능한 오브젝트 이미지" />
                    </ImgBtn>
                );
            })}
        </ImgContainer>
    );
};

export default BuildObject;

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
