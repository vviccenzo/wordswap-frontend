export interface ChatBodyProps {
    messages: any[];
    selectedConversation: any;
    setScrollPage: (page: number) => void;
    scrollPage: number;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export interface MessageProps {
    id: string;
    content: string;
    avatar: string | null;
    senderName: string;
    timestamp: string;
    isEdited: boolean;
    isDeleted: boolean;
    messageContent: string;
    date: string;
}

export interface Conversation {
    id: string;
    messages: Message[];
    profilePicture: string;
    conversationName: string;
}

export interface Message {
    id: string;
    content: string;
    sender: string;
    timeStamp: string;
    edited: boolean;
    deleted: boolean;
    messageContent: string;
    image: string;
    originalContent?: string;
    type: string;
    senderName: string;
    viewed: boolean;
    viewedTime: string;
}

export interface GetMessagePayload {
    userId?: number
    conversationId?: number;
    pageNumber?: number;
    pageSize?: number;
}

export interface ChatFooterProps {
    message: string;
    setMessage: (value: string) => void;
    handleSend: () => void;
    scrollPage: number;

    translationFrom: string;

    popoverVisible: boolean;
    setPopoverVisible: (visible: boolean) => void;

    languageFrom: string;
    setLanguageFrom: (value: string) => void;

    translationReceiving: boolean;
    configurateTranslation: () => void;

    isImprovingText: boolean;
    setIsImprovingText: (value: boolean) => void;
    
    setTranslationReceiving: (value: boolean) => void;
    setTranslationFrom: (value: string) => void;
}

export interface TranslationPopoverProps {
    languageFrom: string;
    setLanguageFrom: (value: string) => void;
    translationReceiving: boolean;
    setTranslationReceiving: (value: boolean) => void;
    configurateTranslation: () => void;
    popoverVisible: boolean;
    setPopoverVisible: (visible: boolean) => void;
    setTranslationFrom: (value: string) => void;
}

export interface ChatHeaderProps {
    profilePicture: string;
    conversationName: string;
    selectedConversation: any;
}