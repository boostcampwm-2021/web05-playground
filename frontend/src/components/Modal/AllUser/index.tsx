/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import styled from 'styled-components';
import { socketClient } from '../../../socket/socket';
import allUserListState from '../../../store/allUserListState';
import { ActiveModal, UserMap } from '../../../utils/model';

const AllUser = ({ active }: ActiveModal) => {
    const [allUser, setAllUser] = useRecoilState(allUserListState);

    useEffect(() => {
        socketClient.on('exitUser', (data: UserMap) => {
            setAllUser(data);
        });

        return () => {
            socketClient.removeListener('exitUser');
        };
    }, [socketClient]);

    return (
        <UserContainer active={active}>
            {Object.keys(allUser).map((id: string) => {
                return (
                    <UserDiv key={id}>
                        <UserImg>
                            <img src={allUser[id].imageUrl} />
                        </UserImg>
                        <UserName>{allUser[id].nickname}</UserName>
                    </UserDiv>
                );
            })}
        </UserContainer>
    );
};

export default AllUser;

const UserContainer = styled.div<ActiveModal>`
    display: ${(props) => (props.active ? 'flex' : 'none')};
    flex-direction: column;
    justify-content: center;
`;

const UserDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 64px;
`;

const UserName = styled.div`
    text-align: center;
    min-width: 150px;
    line-height: 64px;
`;

const UserImg = styled.div`
    max-width: 30px;
    overflow: hidden;
    margin: 0;
    line-height: 64px;
`;
