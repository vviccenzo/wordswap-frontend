import React, { createContext, ReactNode } from 'react';
import { UserContext } from '../UserContext';

const mockUser = {
    id: 1,
    userCode: "user123",
    name: "John Doe",
    profilePic: "http://example.com/profile.jpg",
    bio: "Hello, I'm John!",
};

const mockUserContextValue = {
    user: mockUser,
    setUser: jest.fn(),
    token: "mockToken",
    isLogged: true,
    setToken: jest.fn(),
    setIsLogged: jest.fn(),
    doLogout: jest.fn(),
};

export const MockedUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <UserContext.Provider value={mockUserContextValue}>
            {children}
        </UserContext.Provider>
    );
};
