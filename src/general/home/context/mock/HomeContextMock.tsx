// mocks/HomeContextMock.js
import { useState } from 'react';
import { HomeContext } from '../HomeContext';

const mockConversations = [
    {
        id: '1',
        senderId: '1',
        receiverId: '2',
        conversationName: 'Conversa 1',
        lastMessage: { '2024-10-05T12:00:00Z': 'Olá, como vai?' },
        isArchivedInitiator: false,
        isArchivedRecipient: false,
        profilePic: null,
        totalMessages: 5,
    },
    {
        id: '2',
        senderId: '2',
        receiverId: '1',
        conversationName: 'Conversa 2',
        lastMessage: { '2024-10-06T12:00:00Z': 'Bom dia!' },
        isArchivedInitiator: true,
        isArchivedRecipient: false,
        profilePic: null,
        totalMessages: 3,
    },
];

const mockStompClient = {
    send: jest.fn(),
};

export const HomeContextMock = ({ children }) => {
    const mockHandleConversations = jest.fn();
    const mockHandleConversationSelected = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetScrollPage = jest.fn();
    const mockSetTotalMessages = jest.fn();

    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleModalStatus = (status) => {
        setIsModalOpen(status);
    };

    return (
        <HomeContext.Provider
            value={{
                conversations: mockConversations,
                handleConversations: mockHandleConversations,
                handleConversationSelected: mockHandleConversationSelected,
                setLoading: mockSetLoading,
                setScrollPage: mockSetScrollPage,
                setTotalMessages: mockSetTotalMessages,
                isModalOpen,
                handleModalStatus,
                stompClient: mockStompClient,
            }}
        >
            {children}
        </HomeContext.Provider>
    );
};
