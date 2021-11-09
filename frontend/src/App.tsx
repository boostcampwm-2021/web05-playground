/* eslint-disable no-console */
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';

import Login from './pages/Login';
import SelectWorld from './pages/SelectWorld';
import World from './pages/World';

import './reset.css';

const client = new ApolloClient({
    uri: process.env.REACT_APP_BASE_URI,
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <RecoilRoot>
                <BrowserRouter>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/selectworld" component={SelectWorld} />
                    <Route exact path="/world" component={World} />
                </BrowserRouter>
            </RecoilRoot>
        </ApolloProvider>
    );
}

export default App;
