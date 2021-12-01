/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import styled from 'styled-components';

interface msg {
    [key: number]: string;
}

const ErrorPage = ({ type = 404 }: { type: number }) => {
    const noticeMsg: msg = {
        404: "It seems like we couldn't find the page you were looking for",
        500: 'Something went wrong..',
    };

    const redirectHome = (event: React.MouseEvent) => {
        event.preventDefault();
        window.location.href = '/selectworld';
    };

    return (
        <Background>
            <Logo onClick={(e) => redirectHome(e)}>
                <img src="/assets/logo.png" height="180px" />
            </Logo>
            <Notice>Woops!</Notice>
            <Notice>{noticeMsg[type]}</Notice>
            <ErrorLogo>
                <img src="/assets/sad.png" height="180px" />
            </ErrorLogo>
        </Background>
    );
};

export default ErrorPage;

const Logo = styled.div`
    &:hover {
        cursor: pointer;
    }
`;
const Background = styled.div`
    background-color: #f1ea65;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Notice = styled.div`
    height: 100px;
    font-weight: 700;
    font-size: 30px;
`;

const ErrorLogo = styled.div``;
