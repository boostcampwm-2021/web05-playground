/* eslint-disable no-console */
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';

import ExchangeRates from './components/ExchangeRates';
import SelectWorld from './pages/SelectWorld';

import './reset.css';

const client = new ApolloClient({
    uri: 'https://48p1r2roz4.sse.codesandbox.io', // 우리 url로 수정해야함
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <RecoilRoot>
                <BrowserRouter>
                    <Route exact path="/" component={ExchangeRates} />
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