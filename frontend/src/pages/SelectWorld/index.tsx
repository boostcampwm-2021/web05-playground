/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { getWorldList, getAccessToken } from '../../utils/query';
import { WorldSelector } from '../../components/SelectWorld';
import userState from '../../store/userState';
import Loading from '../Loading';
import ErrorPage from '../Error';

const SelectWorld = (props: RouteComponentProps) => {
    const { loading, error, data } = useQuery(getWorldList, {
        fetchPolicy: 'cache-and-network',
    });
    const [fetchUser] = useMutation(getAccessToken);
    const [user, setUser] = useRecoilState(userState);

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    useEffect(() => {
        if (user.id !== 1) return;
        if (code) {
            const Login = async (code: string) => {
                const userInfo = (await fetchUser({ variables: { code } })).data.user;
                setUser(userInfo);
            };
            Login(code);
            return;
        }
        props.history.push('/login');
    }, []);

    const redirectSetting = (event: React.MouseEvent) => {
        event.preventDefault();
        props.history.push('/setting');
    };

    if (loading) return <Loading />;
    if (error) return <ErrorPage type={500} />;

    return (
        <Background>
            <Logo>
                <img src="/assets/logo.png" height="180px" />
            </Logo>
            <Setting onClick={redirectSetting}>Setting</Setting>
            <WorldSelector props={props} data={data.worldList} />
        </Background>
    );
};
export default SelectWorld;

const Logo = styled.div`
    position: absolute;
    top: 1px;
    left: 1px;
`;

const Setting = styled.button`
    position: absolute;
    top: 3px;
    right: 5px;
    border: none;
    background-color: transparent;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 48px;
    line-height: 56px;

    color: #f35f5f;

    &:hover {
        transform: scale(1.1);
        cursor: pointer;
    }
`;

const Background = styled.div`
    background-color: #f1ea65;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
