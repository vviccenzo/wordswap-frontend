import { ReactNode } from "react";

export interface UserProviderProps {
    children: ReactNode;
}

export interface User {
    name: string;
    email: string;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    isLogged: boolean;
    setToken: (token: string | null) => void;
    setIsLogged: (isLogged: boolean) => void;
}