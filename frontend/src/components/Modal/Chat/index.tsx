import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { socketClient } from '../../../socket/socket';
import ChatList from './ChatList';
import MessageInput from './MessageInput';

import { MessageInfo, ActiveModal } from '../../../utils/model';

const Chat = ({ active }: ActiveModal) => {
    const [messageInfos, setMessages] = useState<MessageInfo[]>([]);

    useEffect(() => {
        socketClient.on('message', (messageInfo: MessageInfo) => {
            setMessages((prev: MessageInfo[]) => [...prev, messageInfo]);
        });
    }, [socketClient]);

    const enterBuilding = () => {
        const roomName = 'In Building';
        socketClient.emit('enterRoom', roomName);
        socketClient.on('enterNewPerson', (data: MessageInfo) => {
            console.log(data);
        });
    };

    return (
        <Wrapper active={active}>
            <ScopeDiv>
                <button type="button">전체</button>
                <button type="button" onClick={enterBuilding}>
                    건물 내 통신
                </button>
            </ScopeDiv>
            <ChatList messageInfos={messageInfos} />
            <MessageInput />
        </Wrapper>
    );
};

export default Chat;

const Wrapper = styled.div<ActiveModal>`
    display: ${(props) => (props.active ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
`;

const ScopeDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;

    & > button {
        border: none;
        margin-right: 5px;
        border-radius: 4px;

        font-size: 25px;

        &:hover {
            cursor: pointer;
            transform: scale(1.2);
        }
    }
`;
