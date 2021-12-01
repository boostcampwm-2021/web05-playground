/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import { useMutation } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';

import styled from 'styled-components';
import userState from '../../store/userState';
import { DEFAULT_INDEX } from '../../utils/constants';
import { Clickable } from '../../utils/css';
import { useSlide } from '../../utils/hooks/useSlide';
import { ICharacter } from '../../utils/model';
import { setUserInfo } from '../../utils/query';

export function CharacterSelector({
    props,
    characterList,
}: {
    props: RouteComponentProps;
    characterList: ICharacter[];
}) {
    const [character, setCharacter] = useState<ICharacter>(characterList[DEFAULT_INDEX]);
    const [current, nextClick, prevClick] = useSlide(characterList, setCharacter);
    const [updateUser, { data, loading, error }] = useMutation(setUserInfo);
    const [user, setUser] = useRecoilState(userState);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        setNickname(user.nickname);
    }, [user]);

    const redirectWorld = async (event: React.MouseEvent) => {
        event.preventDefault();
        setUser({ ...user, nickname, imageUrl: current.imageUrl });
        updateUser({ variables: { id: user.id, nickname, imageUrl: current.imageUrl } });
        props.history.push('/selectworld');
    };

    const onChangeNickname = (e: React.ChangeEvent) => {
        setNickname((e.target as HTMLInputElement).value);
    };
    return (
        <>
            <Selector>
                <img src="/assets/prevbtn.png" onClick={prevClick} height="50px" />
                <Character thumbnail={character.imageUrl} />
                <img src="/assets/nextbtn.png" onClick={nextClick} height="50px" />
            </Selector>
            <Wrapper>
                <Blank />
                <Nickname type="text" onChange={onChangeNickname} value={nickname} />
                <SelectBtn onClick={(e) => redirectWorld(e)}>선택</SelectBtn>
            </Wrapper>
        </>
    );
}

const Character = styled.div<{ thumbnail: string }>`
    height: 400px;
    width: 400px;
    text-align: center;
    line-height: 400px;
    background-image: url('${(props) => props.thumbnail}');
    background-color: #c4c4c4;
    background-size: 400%;
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

const Wrapper = styled.div`
    display: flex;
    width: 800px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Blank = styled.div`
    width: 300px;
`;

const Nickname = styled.input`
    width: 400px;
    height: 60px;

    border-radius: 20px;
    background-color: #ffef6f;

    font-family: Roboto;
    font-style: normal;
    font-weight: 150;
    font-size: 40px;
    font-weight: 500;
    text-align: center;
`;

const SelectBtn = styled.div`
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
    font-size: 40px;
    font-weight: 500;

    ${Clickable}
`;
