import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Clickable } from '../../../utils/css';

const Exit = ({ props }: { props: RouteComponentProps }) => {
    const redirectSelectWorld = (event: React.MouseEvent) => {
        event.preventDefault();
        props.history.push('/selectWorld');
    };

    return (
        <Icons
            src="/assets/logout.png"
            onClick={(e) => {
                redirectSelectWorld(e);
            }}
        />
    );
};

export default Exit;

const Icons = styled.img`
    width: 40px;
    height: 40px;
    ${Clickable}
`;
