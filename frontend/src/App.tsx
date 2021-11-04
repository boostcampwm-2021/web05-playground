/* eslint-disable no-console */
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';

import ExchangeRates from './components/ExchangeRates';

import Login from './pages/Login';
import SelectWorld from './pages/SelectWorld';

import './reset.css';

const client = new ApolloClient({
    uri: process.env.REACT_APP_BASE_URL,
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <RecoilRoot>
                <BrowserRouter>
                    <Route exact path="/" component={ExchangeRates} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/selectworld" component={SelectWorld} />
                    <Route
                        exact
                        path="/world"
                        component={({ location }: any) => {
                            return <div>포트 번호 : {location.state.port}</div>;
                        }}
                    />
                </BrowserRouter>
            </RecoilRoot>
        </ApolloProvider>
    );
}

export default App;
