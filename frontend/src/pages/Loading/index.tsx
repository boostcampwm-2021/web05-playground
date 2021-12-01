import React from 'react';
import { ScaleLoader } from 'react-spinners';
import styled from 'styled-components';

const Loading = () => {
    return (
        <Wrapper>
            <ScaleLoader height="160px" width="60px" color="#f1ea65" radius="10px" />
        </Wrapper>
    );
};

export default Loading;

const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d1daa5;
`;
