import React, { useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import styled from 'styled-components';

import { MessageInfo, MessageInfos } from '../../../../utils/model';

const ChatList = ({ messageInfos }: MessageInfos) => {
    const scrollRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current === null) return;

        scrollRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
        });
    }, [messageInfos]);

    const messages = () => {
        const result = messageInfos.map((messageInfo: MessageInfo) => (
            <div key={nanoid()}>
                <IdDiv>
                    <div>
                        from: {messageInfo.id}{' '}
                        <Target target={messageInfo.target}>to {messageInfo.target}</Target>
                    </div>
                </IdDiv>
                <MessageDiv>{messageInfo.message}</MessageDiv>
            </div>
        ));
        return result;
    };

    return (
        <Wrapper>
            <StyledDiv ref={scrollRef}>{messages()}</StyledDiv>
        </Wrapper>
    );
};

export default ChatList;

const Wrapper = styled.div`
    width: 100%;
    flex-grow: 1;
    overflow-y: auto;
    height: 0px;
    margin-bottom: 10px;
    border-bottom: 2px solid #f2f2f2;

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-thumb {
        height: 13vh;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 12px;
    }
`;

const StyledDiv = styled.div`
    flex-grow: 1;
    list-style: none;
    padding-left: 0;
    padding: 0 10px;
    box-sizing: border-box;
`;

const IdDiv = styled.div`
    padding: 3px;
    margin-left: 5px;
    margin-bottom: 5px;

    font-size: 15px;
    font-weight: bold;
    color: #808080;
`;

const Target = styled.span<any>`
    color: ${(props) => (props.target === 'World' ? '#9986ee' : '#369F36')};
`;

const MessageDiv = styled.div`
    padding: 3px;
    margin: 0px 5px 5px 5px;
`;
