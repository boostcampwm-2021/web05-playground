/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';

import styled from 'styled-components';
import currentWorldState from '../../store/currentWorldState';
import { DEFAULT_INDEX } from '../../utils/constants';
import { Clickable } from '../../utils/css';
import { useSlide } from '../../utils/hooks/useSlide';
import { IWorld } from '../../utils/model';
import SetWorldModal from '../SetWorldModal';

export function WorldSelector({ props, data }: { props: RouteComponentProps; data: IWorld[] }) {
    const [currentWorld, setCurrentWorld] = useRecoilState<IWorld>(currentWorldState);
    const [current, nextClick, prevClick] = useSlide(data, setCurrentWorld);
    const [creationState, setCreationState] = useState(false);

    useEffect(() => {
        setCurrentWorld(data[DEFAULT_INDEX]);
    }, []);
    const redirectWorld = (event: React.MouseEvent) => {
        event.preventDefault();
        props.history.push('/world');
    };

    return (
        <>
            <Selector>
                <ArrowButton src="/assets/prevbtn.png" onClick={prevClick} />
                <World thumbnail={current.thumbnail}>{current.name}</World>
                <ArrowButton src="/assets/nextbtn.png" onClick={nextClick} />
            </Selector>
            <BtnGroup>
                <SelectBtn onClick={(e) => redirectWorld(e)}>선택</SelectBtn>
                <CreateBtn onClick={() => setCreationState(true)}>월드생성</CreateBtn>
            </BtnGroup>
            {creationState ? <SetWorldModal setModalState={setCreationState} /> : null}
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

const ArrowButton = styled.img`
    height: 50px;
    ${Clickable}
`;

const Selector = styled.div`
    display: flex;
    width: 600px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const BtnGroup = styled.div`
    width: 500px;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

    ${Clickable}
`;

const CreateBtn = styled.div`
    margin: 40px;
    height: 60px;
    width: 200px;
    background-color: #c4c4c4;
    text-align: center;
    line-height: 60px;
    border-radius: 20px;

    font-family: Roboto;
    font-style: normal;
    font-weight: 150;
    font-size: 25px;
    font-weight: 500;

    ${Clickable}
`;
