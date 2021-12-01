/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { getCharacterList } from '../../utils/query';
import { CharacterSelector } from '../../components/SelectCharacter';
import Loading from '../Loading';
import ErrorPage from '../Error';

const Setting = (props: RouteComponentProps) => {
    const { loading, error, data } = useQuery(getCharacterList);

    if (loading) return <Loading />;
    if (error) return <ErrorPage type={500} />;

    return (
        <Background>
            <Logo>
                <img src="/assets/logo.png" height="180px" />
            </Logo>
            <CharacterSelector props={props} characterList={data.characterList} />
        </Background>
    );
};
export default Setting;

const Logo = styled.div`
    position: absolute;
    top: 1px;
    left: 1px;
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
