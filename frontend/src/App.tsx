import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './reset.css';

function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <Route
                    exact
                    path="/"
                    component={() => <div className="App" />}
                />
            </BrowserRouter>
        </RecoilRoot>
    );
}

export default App;
