import { useUser } from '../../context/UserContext';
import { useHomeContext } from '../../general/home/context/HomeContext';
import { WebSocketEventType } from '../enum/WebSocketEventType';
import mapConversation from '../mapper/conversationMapper';

export function useHandleCallbackWS() {
    const { user } = useUser();
    const {
        handleConversations,
        handleConversationSelected,
        setFriendRequests,
        setFriendsList,
        selectedConversation
    } = useHomeContext();

    const updateSelectedConversation = (conversationsMapped: any[], conversationData: any) => {
        const updatedConversation = conversationData;
        const conversation = conversationsMapped.find((conv: any) =>
            conv.id === Number(conversationData.id) || (conversationData.isNewConversation &&
                Number(conv.senderId) === Number(conversationData.senderId) &&
                Number(conv.receiverId) === Number(conversationData.receiverId))
        );

        if (conversation) {
            updatedConversation.messages = conversation.messages;
            updatedConversation.lastMessage = conversation.lastMessage;
            updatedConversation.configsUser = conversation.configsUser;
        }

        handleConversationSelected(updatedConversation);
    };

    const handleCallbackWS = (response: any) => {
        const { eventType, data } = response;

        switch (eventType) {
            case WebSocketEventType.SEND_MESSAGE:
            case WebSocketEventType.EDIT_MESSAGE:
            case WebSocketEventType.DELETE_MESSAGE: {
                const conversationsMapped = data.map((conversation: any) => mapConversation(conversation, user.id));
                handleConversations(conversationsMapped);

                const savedConversation = JSON.parse(localStorage.getItem('conversation') || null);
                if (!selectedConversation && savedConversation) {
                    updateSelectedConversation(conversationsMapped, savedConversation);
                    break;
                }

                if (selectedConversation) {
                    updateSelectedConversation(conversationsMapped, selectedConversation);
                    break;
                }

                break;
            }

            case WebSocketEventType.SEND_FRIEND_REQUEST:
            case WebSocketEventType.UPDATE_FRIEND_REQUEST:
                setFriendRequests(data);
                break;

            case WebSocketEventType.DELETE_FRIEND:
            case WebSocketEventType.ACCEPT_FRIEND_REQUEST:
                setFriendsList(data);
                break;

            default:
                console.warn("Unknown event type:", eventType);
        }
    };

    return { handleCallbackWS };
}