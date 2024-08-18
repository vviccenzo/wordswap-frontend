import React, { createContext, useContext, useState } from "react";
import { HomeContextType, HomeProviderProps } from "./IHomeContext.ts";
import { useRequest } from "../../../hook/useRequest.ts";
import { HttpMethods } from "../../../utils/IRequest.ts";
import { Notification } from "../../../utils/Notification.tsx";

const defaultHomeState = {
    isModalOpen: false,
    handleModalStatus: () => { },
    conversations: [],
    handleConversations: () => { },
    selectedConversation: null,
    handleConversationSelected: () => { },
    doStartConversartion: () => { }
};

const HomeContext = createContext<HomeContextType>(defaultHomeState);

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
    const { request } = useRequest();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [conversations, setConversartions] = useState<any[]>([
        {
            id: 1,
            name: 'Jane Smith',
            profilePicture: 'https://i.pravatar.cc/150?img=2',
            messages: [
                { id: 1, sender: 'other', content: 'Hey, how are you?' },
                { id: 2, sender: 'me', content: 'I am good, thanks!' },
                { id: 3, sender: 'other', content: 'Great to hear!' },
            ],
        },
        {
            id: 2,
            name: 'Bob Johnson',
            profilePicture: 'https://i.pravatar.cc/150?img=3',
            messages: [
                { id: 1, sender: 'other', content: 'Let\'s catch up soon!' },
                { id: 2, sender: 'me', content: 'Sure, when are you free?' },
            ],
        },
    ]);

    const doStartConversartion = (friendId: number) => {

        const conversationStarted = {
            id: friendId,
            name: 'John Doe',
            profilePicture: 'https://i.pravatar.cc/150?img=1',
            messages: [
                { id: 1, sender: 'other', content: 'Hey, how are you?' },
                { id: 2, sender: 'me', content: 'I am good, thanks!' },
                { id: 3, sender: 'other', content: 'Great to hear!' },
            ],
        };

        // request({
        //     method: HttpMethods.GET,
        //     url: '/conversartion/start-conversartion?friendId=' + friendId,
        //     successCallback: (data) => {
        //         setSelectedConversation(data);
        //     },
        //     errorCallback: (error) => {
        //         Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
        //     }
        // });

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

    return (
        <HomeContext.Provider value={{
            isModalOpen,
            handleModalStatus,
            conversations,
            handleConversations,
            selectedConversation,
            handleConversationSelected,
            doStartConversartion
        }}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHomeContext = () => useContext(HomeContext);