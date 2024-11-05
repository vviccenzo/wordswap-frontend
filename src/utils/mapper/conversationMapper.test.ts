import mapConversation from './conversationMapper';

describe('mapConversation', () => {
    it('deve mapear e combinar mensagens corretamente, definindo o sender para "me" ou "them"', () => {
        const conversation = {
            id: '1',
            conversationName: 'Test Conversation',
            receiverId: '2',
            senderId: '1',
            profilePic: 'profile-pic-url',
            lastMessage: 'Hello!',
            configsUser: { theme: 'dark' },
            totalMessages: 2,
            receiverCode: 'RC123',
            senderCode: 'SC456',
            userInfo: { name: 'User' },
            isArchivedRecipient: false,
            isArchivedInitiator: false,
            userMessages: [
                { senderId: '1', timeStamp: '2023-01-01T10:00:00Z', content: 'Hello' }
            ],
            targetUserMessages: [
                { senderId: '2', timeStamp: '2023-01-01T10:05:00Z', content: 'Hi!' }
            ],
        };
        const userId = '1';

        const result = mapConversation(conversation, userId);

        expect(result).toEqual({
            id: '1',
            conversationName: 'Test Conversation',
            receiverId: '2',
            senderId: '1',
            profilePic: 'profile-pic-url',
            lastMessage: 'Hello!',
            configsUser: { theme: 'dark' },
            totalMessages: 2,
            receiverCode: 'RC123',
            senderCode: 'SC456',
            userInfo: { name: 'User' },
            isArchivedRecipient: false,
            isArchivedInitiator: false,
            messages: [
                { senderId: '1', timeStamp: '2023-01-01T10:00:00Z', content: 'Hello', sender: 'me' },
                { senderId: '2', timeStamp: '2023-01-01T10:05:00Z', content: 'Hi!', sender: 'them' }
            ]
        });
    });

    it('deve ordenar as mensagens pelo timeStamp', () => {
        const conversation = {
            id: '2',
            conversationName: 'Another Conversation',
            receiverId: '3',
            senderId: '2',
            profilePic: 'another-profile-pic-url',
            lastMessage: 'Bye!',
            configsUser: { theme: 'light' },
            totalMessages: 2,
            receiverCode: 'RC789',
            senderCode: 'SC101',
            userInfo: { name: 'Another User' },
            isArchivedRecipient: true,
            isArchivedInitiator: false,
            userMessages: [
                { senderId: '2', timeStamp: '2023-01-02T10:00:00Z', content: 'Hey' }
            ],
            targetUserMessages: [
                { senderId: '3', timeStamp: '2023-01-01T09:00:00Z', content: 'Hello!' }
            ],
        };
        const userId = '2';

        const result = mapConversation(conversation, userId);

        expect(result.messages).toEqual([
            { senderId: '3', timeStamp: '2023-01-01T09:00:00Z', content: 'Hello!', sender: 'them' },
            { senderId: '2', timeStamp: '2023-01-02T10:00:00Z', content: 'Hey', sender: 'me' }
        ]);
    });
});
