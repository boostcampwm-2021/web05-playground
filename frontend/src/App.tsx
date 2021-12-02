/* eslint-disable no-console */
import React from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';

import Login from './pages/Login';
import SelectWorld from './pages/SelectWorld';
import World from './pages/World';

import './reset.css';
import Setting from './pages/Setting';
import ErrorPage from './pages/Error';

const client = new ApolloClient({
    uri: process.env.REACT_APP_BASE_URI,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

function App() {
    return (
        <ApolloProvider client={client}>
            <RecoilRoot>
                <BrowserRouter>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/setting" component={Setting} />
                    <Route exact path="/selectworld" component={SelectWorld} />
                    <Route exact path="/world" component={World} />
                    <Route path="*" component={ErrorPage} />
                </BrowserRouter>
            </RecoilRoot>
        </ApolloProvider>
    );
}

export default App;
