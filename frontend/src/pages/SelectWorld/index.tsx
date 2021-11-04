/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import currentWorldState from '../../store/currentWorldState';

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

const Selector = styled.div`
    display: flex;
    width: 600px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SelectBtn = styled.div`
    margin: 40px;
    height: 60px;
    width: 400px;
    background-color: #c4c4c4;
    text-align: center;
    line-height: 60px;
    border-radius: 20px;

    font-family: Roboto;
    font-style: normal;
    font-weight: 150;
    font-size: 40px;
    font-weight: 500;
`;

const World = styled.div<{ thumbnail: string }>`
    height: 400px;
    width: 400px;
    text-align: center;
    line-height: 400px;
    background-image: url('${(props) => props.thumbnail}.png');
    background-size: 400px;
    background-color: #c4c4c4;
    border-radius: 20px;

    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 80px;
`;

const getWorldList = gql`
    query Query {
        worldList {
            wid
            thumbnail
            port
            name
            email
        }
    }
`;

const dummy2 = {
    worldList: [
        {
            wid: 1,
            name: 'world1',
            port: 1,
            thumbnail: '/assets/world-park',
            email: 'user1',
        },
        {
            wid: 2,
            name: 'world2',
            port: 2,
            thumbnail: '/assets/world-winter',
            email: 'user2',
        },
    ],
};

interface IWorld {
    wid: number;
    name: string;
    port: number;
    thumbnail: string;
    email: string;
}

interface IData {
    worldList: IWorld[];
}

const SelectWorld = ({ history }: any) => {
    const [data, setWorldList] = useState<IData>(dummy2);
    const [curWorld, setCurWorld] = useState<number>(0);
    const [currentWorld, setCurrentWorld] =
        useRecoilState<IWorld>(currentWorldState);

    useEffect(() => {
        if (currentWorld.name !== 'default')
            history.push({ pathname: '/world' });
    }, [currentWorld]);
  
    const nextClick = () => {
        let cur = curWorld + 1;
        if (cur >= data.worldList.length) cur = 0;
        setCurWorld(cur);
    };

    const prevClick = () => {
        let cur = curWorld - 1;
        if (cur < 0) cur = data.worldList.length - 1;
        setCurWorld(cur);
    };

    const redirectWorld = () => {
        setCurrentWorld(data.worldList[curWorld]);
    };

    return (
        <Backgroud>
            <Logo>
                <img src="/assets/logo.png" height="180px" />
            </Logo>
            <Selector>
                <img
                    src="/assets/prevbtn.png"
                    onClick={prevClick}
                    height="50px"
                />
                <World thumbnail={data.worldList[curWorld].thumbnail}>
                    {data.worldList[curWorld].name}
                </World>
                <img
                    src="/assets/nextbtn.png"
                    onClick={nextClick}
                    height="50px"
                />
            </Selector>
            <SelectBtn onClick={redirectWorld}>선택</SelectBtn>
        </Backgroud>
    );
};
export default SelectWorld;
