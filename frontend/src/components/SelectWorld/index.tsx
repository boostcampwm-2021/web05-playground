/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useRecoilState } from 'recoil';

import styled from 'styled-components';
import currentWorldState from '../../store/currentWorldState';
import { useSlide } from '../../utils/hooks/useSlide';
import { IWorld } from '../../utils/model';

export function WorldSelector({ props, data }: { props: RouteComponentProps; data: IWorld[] }) {
    const [currentWorld, setCurrentWorld] = useRecoilState<IWorld>(currentWorldState);
    const [current, nextClick, prevClick] = useSlide(data, setCurrentWorld);

    useEffect(() => {
        setCurrentWorld(data[0]);
    }, []);
    const redirectWorld = (event: React.MouseEvent) => {
        event.preventDefault();
        props.history.push('/world');
    };

    return (
        <>
            <Selector>
                <img src="/assets/prevbtn.png" onClick={prevClick} height="50px" />
                <World thumbnail={current.thumbnail}>{current.name}</World>
                <img src="/assets/nextbtn.png" onClick={nextClick} height="50px" />
            </Selector>
            <SelectBtn onClick={(e) => redirectWorld(e)}>선택</SelectBtn>
        </>
    );
}

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
