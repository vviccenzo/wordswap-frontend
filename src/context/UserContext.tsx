import React, { createContext, useState, useContext } from 'react';
import { User, UserContextType, UserProviderProps } from './IUser.ts';

const defaultUserState: UserContextType = {
    user: {} as User,
    setUser: (user: User) => { },
    token: "",
    isLogged: false,
    setToken: (token) => { },
    setIsLogged: (isLogged) => { }
};

const UserContext = createContext<UserContextType>(defaultUserState);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({} as User);
    const [token, setToken] = useState<string | null>(null);
    const [isLogged, setIsLogged] = useState<boolean>(false);

    return (
        <UserContext.Provider value={{ user, setUser, token, isLogged, setToken, setIsLogged  }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
