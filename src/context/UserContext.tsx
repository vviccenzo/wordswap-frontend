import React, { createContext, useState, useContext } from 'react';
import doRequest from '../utils/Request.ts';
import { HttpMethods } from '../utils/IRequest.ts';
import { Notification } from '../utils/Notification.tsx';
import { User, UserContextType, UserProviderProps } from './IUser.ts';

const defaultUserState: UserContextType = {
    user: null,
    setUser: (user) => { },
    doLogin: (user, password) => { console.log(user) },
    token: "",
    isLogged: false
};

const UserContext = createContext<UserContextType>(defaultUserState);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLogged, setIsLogged] = useState<boolean>(false);

    function doLogin(user: string, password: string) {
        doRequest({
            method: HttpMethods.POST,
            url: '/auth/login?user=' + user + '&password=' + password,
            successCallback: (data) => {
                setToken(data);
                setIsLogged(true);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error.error, placement: 'top', type: 'error' });
            }
        })
    }

    return (
        <UserContext.Provider value={{ user, setUser, doLogin, token, isLogged }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
