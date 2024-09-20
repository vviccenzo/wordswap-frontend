export default function getContent(user, conv, message) {
    if (!conv.configsUser) {
        return message.content;
    }

    const userId = user.id;
    const config = conv.configsUser[Number(userId)];

    if (config.isSendingTranslation && message.messageContent.contentSending) {
        return message.messageContent.contentSending;
    }

    if (config.isReceivingTranslation && message.messageContent.contentReceiving) {
        return message.messageContent.contentReceiving;
    }

    return message.content;
}