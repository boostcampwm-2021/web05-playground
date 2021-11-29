/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import styled from 'styled-components';
import buildingInfoState from '../../../store/buildingInfoState';
import isInBuildingState from '../../../store/isInBuildingState';
import { socketClient } from '../../../socket/socket';
import { NONE } from '../../../utils/constants';

const BuildingInfo = () => {
    const [buildingInfo, setBuildingInfo] = useRecoilState(buildingInfoState);
    const [password, setPassword] = useState('');
    const [isInbuilding, setIsInBuilding] = useRecoilState(isInBuildingState);

    useEffect(() => {
        socketClient.on('checkCapacity', (isFull: boolean) => {
            if (isFull) {
                alert('방이 꽉찼습니다!');
                return;
            }
            setIsInBuilding(buildingInfo.id);
            cancle();
        });
        return () => {
            socketClient.removeListener('checkCapacity');
        };
    }, [socketClient]);

    const cancle = () => {
        setBuildingInfo({
            isBuilding: false,
            id: 0,
            x: NONE,
            y: NONE,
            uid: NONE,
            description: '',
            scope: '',
            password: '',
            imageUrl: '',
        });
    };

    const enter = () => {
        if (buildingInfo.scope === 'public') joinRoom();
        else if (buildingInfo.password === password) joinRoom();
        else alert('비밀번호가 틀렸습니다!');
    };

    const joinRoom = () => {
        socketClient.emit('checkCapacity', buildingInfo.id.toString(10));
    };

    const changed = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value);
    };

    return (
        <ModalDiv>
            <ElementDiv>
                <TitleTag>건물이름</TitleTag>
                <BuildingP>{buildingInfo.id}</BuildingP>
            </ElementDiv>
            <ElementDiv>
                <TitleTag>설명</TitleTag>
                <BuildingP>{buildingInfo.description}</BuildingP>
            </ElementDiv>
            <ElementDiv>
                <TitleTag>공개여부</TitleTag>
                <BuildingP>{buildingInfo.scope}</BuildingP>
            </ElementDiv>
            {buildingInfo.scope === 'private' ? (
                <ElementDiv>
                    <TitleTag>비밀번호</TitleTag>
                    <InputPassword onChange={changed} />
                </ElementDiv>
            ) : (
                <></>
            )}
            <BtnWrapper>
                <StyledBtn onClick={cancle}>취소</StyledBtn>
                <StyledBtn onClick={enter}>입장</StyledBtn>
            </BtnWrapper>
        </ModalDiv>
    );
};

export default BuildingInfo;

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

const TitleTag = styled.p`
    margin: 0 0 10px 0;
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

const InputPassword = styled.input`
    border: 0;
    border-bottom: black 1px solid;
    background-color: #c4c4c4;
    height: 20px;
    width: 200px;
`;
