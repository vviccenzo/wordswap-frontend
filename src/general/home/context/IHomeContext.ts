import { ReactNode } from "react";

export interface HomeProviderProps {
    children: ReactNode;
}

export interface HomeContextType {
    isModalOpen: boolean;
    handleModalStatus: (isModalOpen: boolean) => void;
    conversations: any[];
    handleConversations: (conversations: any[]) => void;
    selectedConversation: any;
    handleConversationSelected: (conversation: any) => void;
    doStartConversartion: (friendId: number) => void;
    stompClient: any;
    handleStompClient: (stompClient: any) => void;
    isEditModalOpen: boolean;
    handleEditModalStatus: (isEditModalOpen: boolean) => void;
    translationOptions: any[];
    scrollPage: number;
    setScrollPage: (page: number) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    friendRequests: any[];
    setFriendRequests: (friendRequests: any[]) => void;
}