/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { socketClient } from '../../socket/socket';

import buildObjectState from '../../store/buildObjectState';

const setBuildingModal = () => {
    const [buildObject, setBuildObject] = useRecoilState(buildObjectState);

    const cancleBuild = () => {
        const selectedObjectInfo = {
            src: 'none',
            id: -1,
            locationX: -1,
            locationY: -1,
            isLocated: false,
            isData: false,
        };
        setBuildObject(selectedObjectInfo);
    };

    const completeBuild = () => {
        const objectInfo = {
            x: buildObject.locationX,
            y: buildObject.locationY,
            bid: 1, // 추후 수정 해야함
            imageUrl: buildObject.src,
            fileUrl: '',
        };

        socketClient.emit('buildObject', objectInfo);

        const selectedObjectInfo = {
            src: 'none',
            id: -1,
            locationX: -1,
            locationY: -1,
            isLocated: false,
            isData: false,
        };
        setBuildObject(selectedObjectInfo);
        alert('추가되었습니다.');
    };

    return (
        <ModalDiv>
            <BtnWrapper>
                <StyledBtn onClick={cancleBuild}>취소</StyledBtn>
                <StyledBtn onClick={completeBuild}>확인</StyledBtn>
            </BtnWrapper>
        </ModalDiv>
    );
};

export default setBuildingModal;

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
