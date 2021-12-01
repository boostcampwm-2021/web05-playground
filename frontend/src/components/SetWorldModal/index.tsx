/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useMutation } from '@apollo/client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import userState from '../../store/userState';
import { IWorld } from '../../utils/model';
import { fetchCreateWorld, getWorldList } from '../../utils/query';

interface customSetFunctions {
    [FunctionType: string]: React.Dispatch<React.SetStateAction<string>>;
}

interface IWorldList {
    worldList: IWorld[];
}

const SetWorldModal = ({ setModalState }: { setModalState: Dispatch<SetStateAction<boolean>> }) => {
    const [name, setName] = useState('');
    const user = useRecoilValue(userState);
    const [createWorld] = useMutation(fetchCreateWorld, {
        update(cache, { data: { createWorld } }) {
            const { worldList } = cache.readQuery<IWorldList>({ query: getWorldList })!;
            cache.writeQuery({
                query: getWorldList,
                data: { worldList: worldList.concat([createWorld]) },
            });
        },
    });

    const setFunctions: customSetFunctions = {
        name: setName,
    };

    const changed = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFunctions[e.target.id](e.target.value);
    };

    const completeCreation = async () => {
        if (name === '') alert('값을 모두 입력해주세요');
        else {
            const result = await (
                await createWorld({ variables: { id: user.id, name } })
            ).data.createWorld;
            if (result) {
                alert('추가되었습니다.');
                setModalState(false);
            } else {
                alert('월드 생성에 실패하였습니다.');
            }
        }
    };

    return (
        <ModalDiv>
            <ElementDiv>
                <NameTag>월드이름</NameTag>
                <Inputname onChange={changed} id="name" />
            </ElementDiv>

            <BtnWrapper>
                <StyledBtn onClick={() => setModalState(false)}>취소</StyledBtn>
                <StyledBtn onClick={completeCreation}>확인</StyledBtn>
            </BtnWrapper>
        </ModalDiv>
    );
};

export default SetWorldModal;

const ModalDiv = styled.div`
    position: absolute;
    z-index: 3;

    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: #c4c4c4;
    margin: -240px 0 0 -200px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 20px;
    border: 3px solid black;
`;

const ElementDiv = styled.div`
    width: 200px;
`;

const NameTag = styled.p`
    margin: 0 0 10px 0;
`;

const Inputname = styled.input`
    border: 0;
    border-bottom: black 1px solid;
    background-color: #c4c4c4;
    height: 20px;
    width: 200px;
`;

const InputDescription = styled.textarea`
    border: 0;
    height: 40px;
    width: 200px;
    resize: none;
`;

const InputPassword = styled.input`
    border: 0;
    border-bottom: black 1px solid;
    background-color: #c4c4c4;
    height: 20px;
    width: 200px;
`;

const BtnWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 300px;
`;

const StyledBtn = styled.button`
    height: 40px;
    width: 70px;
    background-color: #c4c4c4c4;
    border-radius: 20px;
`;

const RadioWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
