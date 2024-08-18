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
}