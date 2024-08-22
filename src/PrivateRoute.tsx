import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext.tsx';

interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { setUser, setToken } = useUser();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const selectedConversationId = localStorage.getItem('conversationId');

        if (user) {
            setUser(JSON.parse(user));
        }

        if (token) {
            setToken(token);
        }

        // if (selectedConversationId) {
        //     localStorage.removeItem('conversationId');
        // }
    }, [setUser, setToken]);

    const token = localStorage.getItem('token');
    const isLogged = !!token;

    return isLogged ? (
        element
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

export default PrivateRoute;
