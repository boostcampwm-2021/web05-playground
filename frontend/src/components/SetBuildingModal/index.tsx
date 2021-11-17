/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { socketClient } from '../../socket/socket';

import buildBuildingState from '../../store/buildBuildingState';
import { NONE } from '../../utils/constants';

interface customEventTarget extends EventTarget {
    value: string;
}

interface customMouseEvent extends React.MouseEvent<HTMLInputElement, MouseEvent> {
    target: customEventTarget;
}

interface customSetFunctions {
    [FunctionType: string]: React.Dispatch<React.SetStateAction<string>>;
}

const setBuildingModal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [range, setRange] = useState('private');
    const [password, setPassword] = useState('');
    const [buildBuilding, setBuildBuilding] = useRecoilState(buildBuildingState);

    const setFunctions: customSetFunctions = {
        title: setTitle,
        description: setDescription,
        password: setPassword,
    };

    const changed = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFunctions[e.target.id](e.target.value);
    };

    const rangeClicked = (e: customMouseEvent) => {
        const { value } = e.target;
        setRange(value);
    };

    const cancleBuild = () => {
        const selectedBuildingInfo = {
            src: 'none',
            id: NONE,
            locationX: NONE,
            locationY: NONE,
            isLocated: false,
            isData: false,
        };
        setBuildBuilding(selectedBuildingInfo);
    };

    const completeBuild = () => {
        if (title === '' || description === '') alert('값을 모두 입력해주세요');
        else {
            // title => 건물이름이 있어야됨, uid는 수정
            const buildingInfo = {
                x: buildBuilding.locationX,
                y: buildBuilding.locationY,
                uid: 1,
                description,
                scope: range,
                password,
                imageUrl: buildBuilding.src,
            };
            socketClient.emit('buildBuilding', buildingInfo);

            const selectedBuildingInfo = {
                src: 'none',
                id: -1,
                locationX: -1,
                locationY: -1,
                isLocated: false,
                isData: false,
            };
            setBuildBuilding(selectedBuildingInfo);
            alert('추가되었습니다.');
        }
    };

    return (
        <ModalDiv>
            <ElementDiv>
                <TitleTag>건물이름</TitleTag>
                <InputTitle onChange={changed} id="title" />
            </ElementDiv>
            <ElementDiv>
                <TitleTag>설명</TitleTag>
                <InputDescription id="description" onChange={changed} />
            </ElementDiv>
            <ElementDiv>
                <TitleTag>공개여부</TitleTag>
                <RadioWrapper>
                    <div>
                        <input
                            type="radio"
                            name="range"
                            value="private"
                            id="range"
                            defaultChecked
                            onClick={rangeClicked}
                        />
                        private
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="range"
                            value="public"
                            id="range"
                            onClick={rangeClicked}
                        />
                        public
                    </div>
                </RadioWrapper>
            </ElementDiv>
            <ElementDiv>
                <TitleTag>비밀번호</TitleTag>
                <InputPassword id="password" onChange={changed} readOnly={range === 'public'} />
            </ElementDiv>
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

const ElementDiv = styled.div`
    width: 200px;
`;

const TitleTag = styled.p`
    margin: 0 0 10px 0;
`;

const InputTitle = styled.input`
    border: 0;
    border-bottom: black 1px solid;
    background-color: #c4c4c4;
    height: 20px;
    width: 200px;
`;

const InputDescription = styled.textarea`
    border: 0;
    height: 40px;
    width: 200px;
    resize: none;
`;

const InputPassword = styled.input`
    border: 0;
    border-bottom: black 1px solid;
    background-color: #c4c4c4;
    height: 20px;
    width: 200px;
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

const RadioWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
