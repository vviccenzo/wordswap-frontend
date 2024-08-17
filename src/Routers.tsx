import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './general/login/Login.tsx';
import { Register } from './general/register/Register.tsx';

export function Routers() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}
