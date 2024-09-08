import React, { createContext, useContext, useEffect, useState } from "react";
import { useRequest } from "../../../hook/useRequest.ts";
import { HttpMethods } from "../../../utils/IRequest.ts";
import { Notification } from "../../../utils/Notification.tsx";
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
    handleStompClient: () => { },
    isEditModalOpen: false,
    handleEditModalStatus: () => { },
    translationOptions: [],
    scrollPage: 0,
    setScrollPage: () => { },
    loading: false,
    setLoading: () => { },
    friendRequests: [],
    setFriendRequests: () => { },
    friendsList: [],
    setFriendsList: () => { },
    totalMessages: 0,
    setTotalMessages: () => { }
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
    const [loading, setLoading] = useState<boolean>(false);
    const [scrollPage, setScrollPage] = useState<number>(1);
    const [friendRequests, setFriendRequests] = useState<any[]>([]);
    const [friendsList, setFriendsList] = useState<any[]>([]);
    const [totalMessages, setTotalMessages] = useState<any>(0);

    const doStartConversartion = (data) => {
        const conversationStarted = {
            id: data.conversationId,
            receiverId: data.id,
            conversationName: data.label,
            profilePic: data.profilePicture,
            messages: [],
            isNewConversartion: true,
            senderId: data.senderId
        };

        setConversartions([conversationStarted, ...conversations]);
        setSelectedConversation(conversationStarted);
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (selectedConversation) {
            request({
                method: HttpMethods.GET,
                url: '/translation/find-options-translation',
                successCallback: (data) => setTranslationOptions(data),
                errorCallback: (error) => Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' })
            });
        }
    }, []);

    function handleModalStatus(status: boolean) {
        setIsModalOpen(status);
    }

    function handleConversations(data: any) {
        setConversartions(data);
    }

    function handleConversationSelected(data: any) {
        setSelectedConversation(data);
        setTotalMessages(data.totalMessages || 0);
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
            translationOptions,
            scrollPage,
            setScrollPage,
            loading,
            setLoading,
            friendRequests,
            setFriendRequests,
            friendsList,
            setFriendsList,
            totalMessages,
            setTotalMessages
        }}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHomeContext = () => useContext(HomeContext);