import { useUser } from '../context/UserContext.tsx';
import { useHomeContext } from '../general/home/context/HomeContext.tsx';
import { WebSocketEventType } from '../utils/enum/WebSocketEventType.ts';

import mapConversation from './mapper/conversationMapper.ts';

export function useHandleCallbackWS() {
    const { user } = useUser();
    const { handleConversations, handleConversationSelected, selectedConversation, setFriendRequests } = useHomeContext();

    const handleCallbackWS = (response) => {
        const eventType = response.eventType;

        switch (eventType) {
            case WebSocketEventType.SEND_MESSAGE:
            case WebSocketEventType.EDIT_MESSAGE:
            case WebSocketEventType.DELETE_MESSAGE:
                const conversationsMapped = response.data.map((conversation: any) => mapConversation(conversation, user.id));

                handleConversations(conversationsMapped);

                if (selectedConversation.id) {
                    const conversation = conversationsMapped.find((conv: any) => conv.id === Number(selectedConversation.id));
                    const conversationToUpdate = selectedConversation;

                    if (conversation) {
                        conversationToUpdate.messages = conversation.messages;
                        conversationToUpdate.lastMessage = conversation.lastMessage;
                    }

                    handleConversationSelected(conversationToUpdate);
                } else if (selectedConversation.isNewConversation) {
                    const conversation = conversationsMapped.find((conv: any) =>
                        Number(conv.senderId) === Number(selectedConversation.senderId) &&
                        Number(conv.receiverId) === Number(selectedConversation.receiverId)
                    );
                    const conversationToUpdate = selectedConversation;

                    if (conversation) {
                        conversationToUpdate.messages = conversation.messages;
                        conversationToUpdate.lastMessage = conversation.lastMessage;
                    }

                    handleConversationSelected(conversationToUpdate);
                }

                break;

            case WebSocketEventType.SEND_FRIEND_REQUEST:
                setFriendRequests(response.data);
                break;

            default:
                console.warn("Unknown event type:", eventType);
        }
    };

    return { handleCallbackWS };
}
