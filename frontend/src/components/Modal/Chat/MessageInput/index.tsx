import React, { useRef, useState } from 'react';

import styled from 'styled-components';

import { socketClient } from '../../../../socket/socket';

const MessageInput = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const sendMessage = () => {
        // 여기서도 유저의 정보가 필요함
        // 근데 캐릭터 무빙 데이터를 참조하기에는 캐릭터 이동 할때마다 렌더링 되서 좀 그럼...
        // id는 따로 분리할까? 상태 말하는거임
        if (inputRef.current === null) return;

        const message = inputRef.current.value;
        if (!message) return;
        inputRef.current.value = '';
        const messageInfo = {
            id: 'wnsgur',
            message,
        };
        socketClient.emit('message', messageInfo);
    };

    return (
        <Wrapper>
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
    align-items: center;
    justify-content: center;
    height: 5%;
    width: 100%;
    margin-bottom: 100px;

    & > input {
        width: 100%;
        height: 5vh;
        margin: 0px 10px 0px 10px;
        border: 2px solid rgba(202, 216, 255, 0.6);
        border-radius: 16px;

        font-size: 15px;
    }
`;
