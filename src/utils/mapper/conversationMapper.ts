export default function mapConversation(conversation: any, userId: any): any {
    const combinedMessages = [
        ...conversation.userMessages.map((msg: any) => ({
            ...msg,
            sender: msg.senderId === userId ? 'me' : 'them'
        })),
        ...conversation.targetUserMessages.map((msg: any) => ({
            ...msg,
            sender: msg.senderId === userId ? 'me' : 'them'
        })),
    ];

    combinedMessages.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

    return {
        id: conversation.id,
        conversationName: conversation.conversationName,
        profilePic: conversation.profilePic,
        messages: combinedMessages,
        lastMessage: conversation.lastMessage,
    };
}