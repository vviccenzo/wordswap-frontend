export default function getContent(user, conv, message) {
    const userId = user.id;
    const config = conv.configsUser[userId];

    if (config.isSendingTranslation && message.messageContent.contentSending) {
        return message.messageContent.contentSending;
    }

    if (config.isReceivingTranslation && message.messageContent.contentReceiving) {
        return message.messageContent.contentReceiving;
    }

    const configOtherUser = conv.configsUser[conv.receiverId];
    if (configOtherUser.isSendingTranslation && message.messageContent.contentSending) {
        return message.messageContent.contentSending;
    }

    if (configOtherUser.isReceivingTranslation && message.messageContent.contentReceiving) {
        return message.messageContent.contentReceiving;
    }

    return message.content;
}