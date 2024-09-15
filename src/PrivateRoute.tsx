import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext.tsx';
import { useRequest } from './hook/useRequest.ts';
import { HttpMethods } from './utils/IRequest.ts';

interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { request } = useRequest();
    const { setUser, setToken, token } = useUser();

    const location = useLocation();

    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token) {
            request({
                method: HttpMethods.GET,
                url: '/auth/token/validate-token?token=' + token,
                successCallback: (data) => {
                    if (data.isValid) {
                        setIsTokenValid(true);
                        if (user) {
                            setUser(JSON.parse(user));
                        }

                        setToken(token);
                    } else {
                        setIsTokenValid(false);
                        localStorage.clear();
                    }
                },
                errorCallback: () => {
                    setIsTokenValid(false);
                    localStorage.clear();
                }
            });
        } else {
            setIsTokenValid(false);
        }

        localStorage.removeItem('conversation');
    }, [setUser, setToken, token]);

    if (isTokenValid === null) {
        return null;
    }

    return isTokenValid ? (
        element
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

export default PrivateRoute;
