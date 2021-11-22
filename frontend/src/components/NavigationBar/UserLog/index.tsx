import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { socketClient } from '../../../socket/socket';

const UserLog = () => {
    const [logList, setLogList] = useState('로그');

    useEffect(() => {
        socketClient.on('enterNewPerson', (nickname: string) => {
            setLogList(`${nickname}님이 입장하셨습니다.`);
        });
    }, []);

    return <LogDiv>{logList}</LogDiv>;
};

export default UserLog;

const LogDiv = styled.div`
    width: 35vw;
    height: 30px;
    background-color: #c4c4c4;
    border-radius: 20px;
    text-align: center;
    line-height: 30px;
`;
