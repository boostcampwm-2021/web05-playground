/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-template-curly-in-string */
import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';

import Exit from './Exit';
import UserLog from './UserLog';
import Menu from './Menu';

const NavigationBar = ({ props }: { props: RouteComponentProps }) => {
    return (
        <FixedDiv>
            <SideDiv>
                <Exit props={props} />
                <UserLog />
            </SideDiv>
            <img src="/assets/navLogo.png" width="90px" height="80px" />
            <SideDiv>
                <Menu props={props} />
            </SideDiv>
        </FixedDiv>
    );
};

export default NavigationBar;

const FixedDiv = styled.div`
    position: fixed;
    z-index: 4;

    width: 100vw;
    height: 80px;
    left: 0;
    bottom: 0;
    background: #f1ea65;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;

const SideDiv = styled.div`
    width: 45vw;
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;
