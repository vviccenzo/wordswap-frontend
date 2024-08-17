import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext.tsx';

interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { isLogged } = useUser();
    const location = useLocation();

    return isLogged ? (
        element
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

export default PrivateRoute;
