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

    return (
        <Wrapper active={active}>
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
