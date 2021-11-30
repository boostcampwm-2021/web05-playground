import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import styled from 'styled-components';
import { socketClient } from '../../../socket/socket';
import allUserListState from '../../../store/allUserListState';
import { IUser } from '../../../utils/model';

const UserLog = () => {
    const [logList, setLogList] = useState('로그');
    const [allUser, setAllUser] = useRecoilState(allUserListState);

    useEffect(() => {
        socketClient.on('enterNewPerson', (user: IUser) => {
            setAllUser({ ...allUser, ...{ [user.id]: user } });
            setLogList(`${user.nickname}님이 입장하셨습니다.`);
        });

        return () => {
            socketClient.removeListener('enterNewPerson');
        };
    }, [socketClient, allUser]);

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
