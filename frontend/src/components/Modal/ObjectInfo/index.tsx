/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import styled from 'styled-components';
import objectInfoState from '../../../store/objectInfoState';
import { NONE } from '../../../utils/constants';

const ObjectInfo = () => {
    const [objectInfo, setObjectInfo] = useRecoilState(objectInfoState);

    const cancle = () => {
        setObjectInfo({
            isObject: false,
            id: 0,
            bid: NONE,
            x: NONE,
            y: NONE,
            imageUrl: '',
            fileUrl: '',
        });
    };

    return (
        <ModalDiv>
            <ElementDiv>
                <BuildingP>오브젝트 ID : {objectInfo.id}</BuildingP>
            </ElementDiv>
            <ElementDiv>
                {objectInfo.fileUrl === '' ? null : (
                    <StyledA
                        target="_blank"
                        href={`https://${process.env.REACT_APP_PREFIX}${objectInfo.fileUrl}`}
                        download
                        rel="noreferrer"
                    >
                        {objectInfo.fileUrl}
                    </StyledA>
                )}
            </ElementDiv>
            <BtnWrapper>
                <StyledBtn onClick={cancle}>취소</StyledBtn>
            </BtnWrapper>
        </ModalDiv>
    );
};

export default ObjectInfo;

const ModalDiv = styled.div`
    position: absolute;
    z-index: 3;

    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: #c4c4c4;
    margin: -240px 0 0 -200px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 20px;
    border: 3px solid black;
`;

const ElementDiv = styled.div`
    width: 200px;
`;

const BuildingP = styled.p`
    color: #000000;
`;

const BtnWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 300px;
`;

const StyledBtn = styled.button`
    height: 40px;
    width: 70px;
    background-color: #c4c4c4c4;
    border-radius: 20px;
`;

const StyledA = styled.a`
    max-width: 100px;
    word-break: break-all;
`;
