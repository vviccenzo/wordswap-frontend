import { ReactNode } from "react";

export interface UserProviderProps {
    children: ReactNode;
}

export interface User {
    id: number;
    name?: string;
    email?: string;
    profilePic?: any[];
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    token: string | null;
    isLogged: boolean;
    setToken: (token: string | null) => void;
    setIsLogged: (isLogged: boolean) => void;
    doLogout: () => void;
}