/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState } from 'react';

import styled from 'styled-components';

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
    const setFunctions: customSetFunctions = {
        title: setTitle,
        description: setDescription,
    };

    const changed = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFunctions[e.target.id](e.target.value);
    };

    const clicked = (e: customMouseEvent) => {
        const { value } = e.target;
        setRange(value);
    };

    return (
        <ModalDiv>
            <ElementDiv>
                <TitleTag>건물이름</TitleTag>
                <InputTitle onChange={(e) => changed(e)} id="title" />
            </ElementDiv>
            <ElementDiv>
                <TitleTag>설명</TitleTag>
                <InputDescription id="description" onChange={(e) => changed(e)} />
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
                            onClick={(e: customMouseEvent) => {
                                clicked(e);
                            }}
                        />
                        private
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="range"
                            value="public"
                            id="range"
                            onClick={(e: customMouseEvent) => {
                                clicked(e);
                            }}
                        />
                        public
                    </div>
                </RadioWrapper>
            </ElementDiv>
            <BtnWrapper>
                <StyledBtn
                    onClick={() => {
                        if (title === '' || description === '') alert('값을 모두 입력해주세요');
                        else {
                            console.log(
                                `이름 : ${title}\n설명 : ${description}\n공개범위 : ${range}`,
                            );
                            alert('추가되었습니다.');
                        }
                    }}
                >
                    확인
                </StyledBtn>
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

const BtnWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
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
