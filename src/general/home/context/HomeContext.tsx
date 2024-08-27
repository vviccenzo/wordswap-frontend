import React, { createContext, useContext, useEffect, useState } from "react";
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
    doStartConversartion: () => { },
    fetchConversations: () => { },
    stompClient: null,
    handleStompClient: () => { },
    isEditModalOpen: false,
    handleEditModalStatus: () => { },
    translationOptions: [],
};

const HomeContext = createContext<HomeContextType>(defaultHomeState);

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {

    const { request } = useRequest();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [conversations, setConversartions] = useState<any[]>([]);
    const [stompClient, setStompClient] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [translationOptions, setTranslationOptions] = useState<any[]>([]);

    const doStartConversartion = (friend) => {
        const conversationStarted = {
            id: friend.conversationId,
            friendId: friend.id,
            name: friend.label,
            profilePicture: friend.profilePicture,
            messages: [],
        };

        setConversartions([conversationStarted, ...conversations]);
        setSelectedConversation(conversationStarted);
        setIsModalOpen(false);
    }

    useEffect(() => {
        request({
            method: HttpMethods.GET,
            url: '/translation/find-options-translation',
            successCallback: (data) => setTranslationOptions(data),
            errorCallback: (error) => Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' })
        });
    }, []);

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

    function handleEditModalStatus(status: boolean) {
        setIsEditModalOpen(status);
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
            handleStompClient,
            isEditModalOpen,
            handleEditModalStatus,
            translationOptions
        }}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHomeContext = () => useContext(HomeContext);