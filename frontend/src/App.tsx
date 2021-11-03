import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';

import ExchangeRates from './components/ExchangeRates';
import Login from './pages/Login';

import './reset.css';

const client = new ApolloClient({
    uri: 'https://48p1r2roz4.sse.codesandbox.io',
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <RecoilRoot>
                <BrowserRouter>
                    <Route exact path="/" component={ExchangeRates} />
                    <Route exact path="/login" component={Login} />
                </BrowserRouter>
            </RecoilRoot>
        </ApolloProvider>
    );
}

export default App;
