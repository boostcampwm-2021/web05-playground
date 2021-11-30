import React from 'react';
import styled from 'styled-components';

import mainTitleLogo from '../../assets/mainTitle.png';
import mainBackground from '../../assets/mainBackground.png';
import { Clickable } from '../../utils/css';

const Login = () => {
    const requestLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = process.env.REACT_APP_AUTH_URL!;
        window.location.href = url;
    };

    return (
        <Wrapper>
            <TitleImg src={mainTitleLogo} alt="메인 타이틀 로고" />
            <BackgroundImg src={mainBackground} alt="메인 배경" />
            <Form onSubmit={requestLogin}>
                <LoginBtn type="submit">Github로 로그인</LoginBtn>
            </Form>
        </Wrapper>
    );
};

export default Login;

const Wrapper = styled.div`
    background-color: #f1ea65;
    height: 100vh;
`;

const TitleImg = styled.img`
    display: block;
    margin: 0px auto;
    padding-top: 20px;
`;

const BackgroundImg = styled.img`
    height: 43vh;
`;

const Form = styled.form`
    width: 33%;
    margin: 0px auto;

    & > button {
        display: block;
        width: 420px;
        height: 10vh;
        margin: 0px auto;

        background-color: rgb(6, 214, 160);
        border: 2px solid transparent;
        border-radius: 32px;
        font-weight: bold;
        font-size: large;
    }
`;

const LoginBtn = styled.button`
    ${Clickable}
`;
