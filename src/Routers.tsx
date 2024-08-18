import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './general/login/Login.tsx';
import { Register } from './general/register/Register.tsx';
import { Home } from './general/home/Home.tsx';

import PrivateRoute from './PrivateRoute.tsx';

export function Routers() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<PrivateRoute element={<Home />} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}
