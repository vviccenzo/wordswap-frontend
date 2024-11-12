export default function mapConversation(conversation: any, userId: any): any {
    const combinedMessages = conversation.messages.map((msg: any) => ({
        ...msg,
        sender: msg.senderId === userId ? 'me' : 'them',
        senderName: msg.sender,
    }));

    combinedMessages.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

    return {
        id: conversation.id,
        conversationName: conversation.conversationName,
        conversationCode: conversation.conversationCode,
        receiverId: conversation.receiverId,
        senderId: conversation.senderId,
        profilePic: conversation.profilePic,
        messages: combinedMessages,
        lastMessage: conversation.lastMessage,
        configsUser: conversation.configsUser,
        totalMessages: conversation.totalMessages,
        receiverCode: conversation.receiverCode,
        senderCode: conversation.senderCode,
        userInfo: conversation.userInfo,
        type: conversation.type,
    };
}
