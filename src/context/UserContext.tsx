import React, { createContext, useState, useContext } from 'react';
import { User, UserContextType, UserProviderProps } from './IUser';

const defaultUserState: UserContextType = {
    user: {} as User,
    setUser: (user: User) => { },
    token: "",
    isLogged: false,
    setToken: (token) => { },
    setIsLogged: (isLogged) => { },
    doLogout: () => { }
};

export const UserContext = createContext<UserContextType>(defaultUserState);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({} as User);
    const [token, setToken] = useState<string | null>(null);
    const [isLogged, setIsLogged] = useState<boolean>(false);

    function doLogout() {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <UserContext.Provider value={{ user, setUser, token, isLogged, setToken, setIsLogged, doLogout  }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
