import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Home } from './general/home/Home';
import { Login } from './general/login/Login';
import { Register } from './general/register/Register';

import PrivateRoute from './PrivateRoute';

export function Routers() {

    const token = localStorage.getItem('token');
    const isLogged = !!token;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={isLogged ? <Navigate to="/home" /> : <Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<PrivateRoute element={<Home />} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}
