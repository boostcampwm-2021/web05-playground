import React from 'react';
import { useRecoilState } from 'recoil';

import styled from 'styled-components';

import currentModalState from '../../store/currentModalState';

const ModalDiv = styled.div`
    height: 100vh;
    width: 400px;
    background: #c4c4c4;
    position: fixed;
    right: 0;
    top: 0px;
`;

const BackBtn = styled.img`
    padding: 10px;
    width: 30px;
    height: 30px;
`;

const Modal = () => {
    const [currentModal, setCurrentModal] = useRecoilState(currentModalState);
    return (
        <ModalDiv>
            <BackBtn src="/assets/nextbtn.png" onClick={() => setCurrentModal('none')} />
            {currentModal}
        </ModalDiv>
    );
};

export default Modal;
