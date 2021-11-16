import React from 'react';
import styled from 'styled-components';

const Exit = () => {
    return (
        <Icons
            src="/assets/logout.png"
            onClick={() => {
                console.log('나가기');
            }}
        />
    );
};

export default Exit;

const Icons = styled.img`
    width: 40px;
    height: 40px;
`;
