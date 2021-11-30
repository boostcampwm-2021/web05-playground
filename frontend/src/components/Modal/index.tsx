import React from 'react';
import { useRecoilState } from 'recoil';

import styled from 'styled-components';

import BuildBuilding from './BuildBuilding';
import BuildObject from './BuildObject';
import Chat from './Chat';

import currentModalState from '../../store/currentModalState';
import { Clickable } from '../../utils/css';
import { ActiveModal } from '../../utils/model';

const Modal = () => {
    const [currentModal, setCurrentModal] = useRecoilState(currentModalState);

    return (
        <ModalDiv active={currentModal === 'none'}>
            <BackBtn src="/assets/nextbtn.png" onClick={() => setCurrentModal('none')} />
            <BuildBuilding active={currentModal === 'buildBuilding'} />
            <BuildObject active={currentModal === 'buildObject'} />
            <Chat active={currentModal === 'chat'} />
        </ModalDiv>
    );
};

export default Modal;

const ModalDiv = styled.div<ActiveModal>`
    position: fixed;
    z-index: 3;

    height: 100vh;
    width: 400px;
    background: #c4c4c4;
    right: 0;
    top: 0px;
    border: 3px solid black;

    display: ${(props) => (props.active === true ? 'none' : 'flex')};
    flex-direction: column;
`;

const BackBtn = styled.img`
    padding: 10px;
    width: 30px;
    height: 30px;

    ${Clickable}
`;
