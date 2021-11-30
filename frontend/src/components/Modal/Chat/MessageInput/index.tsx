import React, { useRef, useState } from 'react';

import styled from 'styled-components';

import { useRecoilValue } from 'recoil';
import { socketClient } from '../../../../socket/socket';

import { ModalToggle } from '../../../../utils/model';

import userState from '../../../../store/userState';

interface customMouseEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
    target: HTMLButtonElement;
}

const MessageInput = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedGroup, setSelectedGroup] = useState('Everyone');
    const [modalToggle, setModalTogle] = useState(false);
    const useInfo = useRecoilValue(userState);

    const selectGroup = (e: customMouseEvent) => {
        const selectedValue = e.target.innerText;
        setSelectedGroup(selectedValue);
        setModalTogle(!modalToggle);
    };

    const sendMessage = () => {
        if (inputRef.current === null) return;

        const message = inputRef.current.value;
        if (!message) return;

        inputRef.current.value = '';
        const messageInfo = {
            id: useInfo.nickname,
            message,
        };

        if (selectedGroup === 'In Building') {
            socketClient.emit('message', messageInfo, useInfo.isInBuilding.toString(10));
            return;
        }
        socketClient.emit('message', messageInfo, selectedGroup);
    };

    return (
        <Wrapper>
            <GroupSelectDiv>
                <p>To</p>
                <div>
                    <StyledButton type="button" onClick={() => setModalTogle(!modalToggle)}>
                        <span>{selectedGroup}</span>
                        <img src="assets/below.png" alt="아래 표식" />
                    </StyledButton>
                    <GroupModal modalToggle={modalToggle}>
                        <button type="button" onClick={selectGroup}>
                            Everyone
                        </button>
                        <button type="button" onClick={selectGroup}>
                            In Building
                        </button>
                    </GroupModal>
                </div>
            </GroupSelectDiv>
            <input
                type="text"
                name="message"
                id="message"
                placeholder="message"
                ref={inputRef}
                onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
            />
        </Wrapper>
    );
};

export default MessageInput;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 10%;
    width: 100%;
    margin-bottom: 100px;

    & > input {
        width: 90%;
        height: 5vh;
        margin: 0px 10px 0px 10px;
        border: 2px solid rgba(202, 216, 255, 0.6);
        border-radius: 16px;

        font-size: 15px;
    }
`;

const GroupSelectDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    width: 100%;
    padding-left: 30px;
    margin-bottom: 10px;

    & > p {
        margin-right: 10px;
    }
`;

const StyledButton = styled.button`
    border: none;
    border-radius: 16px;
    max-width: 200px;
    height: 3vh;

    & > span {
        margin-right: 3px;
    }

    &:hover {
        cursor: pointer;
    }
`;

const GroupModal = styled.div<ModalToggle>`
    position: absolute;
    display: ${(props) => (props.modalToggle ? 'flex' : 'none')};
    flex-direction: column;

    bottom: 20vh;
    left: 35px;
    padding-top: 16px;
    padding-bottom: 16px;
    width: 45%;

    background-color: rgb(202, 216, 255);
    border-radius: 16px;

    & > button {
        border: none;
        border-radius: 0px;
        margin: 0px 5px 0px 5px;
        padding: 8px 0 8px 0px;
        width: 95%;
        background-color: rgb(202, 216, 255);

        &:hover {
            cursor: pointer;
            transform: scale(1.05);
            background-color: #819ff7;
        }
    }
`;
