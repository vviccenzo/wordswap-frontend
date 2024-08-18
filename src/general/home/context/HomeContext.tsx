import React, { createContext, useContext, useState } from "react";
import { HomeContextType, HomeProviderProps } from "./IHomeContext.ts";

const defaultHomeState = {
    isModalOpen: false,
    handleModalStatus: () => { },
    conversations: [],
    handleConversations: () => { },
    selectedConversation: null,
    handleConversationSelected: () => { },
    doStartConversartion: () => { },
    fetchConversations: () => { },
    stompClient: null,
    handleStompClient: () => { }
};

const HomeContext = createContext<HomeContextType>(defaultHomeState);

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [conversations, setConversartions] = useState<any[]>([]);
    const [stompClient, setStompClient] = useState<any>(null);

    const doStartConversartion = (friend) => {
        const conversationStarted = {
            id: friend.conversationId,
            friendId: friend.id,
            name: friend.label,
            profilePicture: friend.profilePicture,
            messages: [
                { id: 1, sender: 'other', content: 'Hey, how are you?' },
                { id: 2, sender: 'me', content: 'I am good, thanks!' },
                { id: 3, sender: 'other', content: 'Great to hear!' },
            ],
        };

        setConversartions([conversationStarted, ...conversations]);
        setSelectedConversation(conversationStarted);
        setIsModalOpen(false);
    }

    function handleModalStatus(status: boolean) {
        setIsModalOpen(status);
    }

    function handleConversations(data: any) {
        setConversartions(data);
    }

    function handleConversationSelected(data: any) {
        setSelectedConversation(data);
    }

    function handleStompClient(data: any) {
        setStompClient(data);
    }

    return (
        <HomeContext.Provider value={{
            isModalOpen,
            handleModalStatus,
            conversations,
            handleConversations,
            selectedConversation,
            handleConversationSelected,
            doStartConversartion,
            stompClient,
            handleStompClient
        }}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHomeContext = () => useContext(HomeContext);