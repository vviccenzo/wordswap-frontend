import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType';
import { deleteMessage, editMessage, handleSend } from './messageService';

describe('messageService', () => {
    const stompClientMock = {
        send: jest.fn(),
    };
    const userId = '12345';
    const selectedConversation = {
        id: 'conv-1',
        senderId: 'sender-1',
        receiverId: 'receiver-1',
    };

    const messageContent = 'Olá, como você está?';
    const scrollPage = 1;
    let message;
    let setMessage;

    beforeEach(() => {
        jest.clearAllMocks();
        message = messageContent;
        setMessage = jest.fn();
    });

    it('deve enviar uma mensagem editada via WebSocket', () => {
        const messageEdit = { id: 'msg-1', content: 'Nova mensagem' };

        editMessage(stompClientMock, userId, messageEdit);

        expect(stompClientMock.send).toHaveBeenCalledWith(`/app/chat/${userId}`, {}, JSON.stringify({
            action: "EDIT_MESSAGE",
            messageEditDTO: {
                id: messageEdit.id,
                content: messageEdit.content,
            },
        }));
    });

    it('deve enviar uma mensagem deletada via WebSocket', () => {
        const messageId = 'msg-1';

        deleteMessage(stompClientMock, userId, messageId);

        expect(stompClientMock.send).toHaveBeenCalledWith(`/app/chat/${userId}`, {}, JSON.stringify({
            action: "DELETE_MESSAGE",
            messageDeleteDTO: {
                id: messageId,
            },
        }));
    });

    test('deve enviar uma mensagem via WebSocket', () => {
        handleSend(stompClientMock, { id: userId }, selectedConversation, message, scrollPage, setMessage);

        expect(stompClientMock.send).toHaveBeenCalledWith(`/app/chat/${userId}`, {}, JSON.stringify({
            action: WebSocketEventType.SEND_MESSAGE,
            messageCreateDTO: {
                senderId: userId,
                receiverId: userId === selectedConversation.receiverId ? selectedConversation.senderId : selectedConversation.receiverId,
                conversationId: selectedConversation.id,
                content: message,
                scrollPage: scrollPage,
            }
        }));

        expect(setMessage).toHaveBeenCalledWith('');
    });
});
