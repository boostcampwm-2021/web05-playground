/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { getWorldList } from '../../utils/query';
import { WorldSelector } from '../../components/SelectWorld';

const SelectWorld = (props: RouteComponentProps) => {
    const { loading, error, data } = useQuery(getWorldList);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <Backgroud>
            <Logo>
                <img src="/assets/logo.png" height="180px" />
            </Logo>
            <WorldSelector props={props} data={data.worldList} />
        </Backgroud>
    );
};
export default SelectWorld;

const Logo = styled.div`
    position: absolute;
    top: 1px;
    left: 1px;
`;

const Backgroud = styled.div`
    background-color: #f1ea65;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
