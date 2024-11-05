import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType';

export const editMessage = (stompClient, userId, message) => {
    stompClient.send(`/app/chat/${userId}`, {}, JSON.stringify({
        action: "EDIT_MESSAGE",
        messageEditDTO: {
            id: message.id,
            content: message.content,
        },
    }));
};

export const deleteMessage = (stompClient, userId, messageId) => {
    stompClient.send(`/app/chat/${userId}`, {}, JSON.stringify({
        action: "DELETE_MESSAGE",
        messageDeleteDTO: {
            id: messageId,
        },
    }));
};

export const handleSend = (stompClient, user, selectedConversation, message, scrollPage, setMessage) => {
    if (message.trim()) {
        const messageRequest = {
            action: WebSocketEventType.SEND_MESSAGE,
            messageCreateDTO: {
                senderId: user?.id,
                receiverId: user.id === selectedConversation?.receiverId ? selectedConversation?.senderId : selectedConversation?.receiverId,
                conversationId: selectedConversation?.id,
                content: message,
                scrollPage,
            }
        };

        stompClient.send('/app/chat/' + user.id, {}, JSON.stringify(messageRequest));
        setMessage('');
    }
};
