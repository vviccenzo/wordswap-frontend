export default function getContent(user, conv, message) {
    const userId = user.id;
    const userConfig = conv.configsUser[userId];
    const otherUserConfig = conv.configsUser[conv.receiverId === userId ? conv.senderId : conv.receiverId];

    // 1. Se a configuração de recebimento de tradução do usuário atual estiver ativada,
    //    ele verá a mensagem na língua configurada para recebimento.
    if (userConfig.isReceivingTranslation && message.messageContent.contentReceiving) {
        return message.messageContent.contentReceiving;
    }

    // 2. Se a configuração de recebimento de tradução do usuário atual estiver desativada
    //    e o outro usuário configurou para enviar traduzido, o usuário verá a mensagem traduzida
    //    conforme a configuração do outro usuário.
    if (!userConfig.isReceivingTranslation && otherUserConfig.isSendingTranslation && message.messageContent.contentSending) {
        return message.messageContent.contentSending;
    }

    // 3. Se a configuração de envio de tradução do usuário atual estiver ativada,
    //    ele verá a mensagem na língua configurada para envio (caso ele esteja revisando a própria mensagem).
    if (userConfig.isSendingTranslation && message.messageContent.contentSending) {
        return message.messageContent.contentSending;
    }

    // 4. Caso nenhuma das condições acima seja verdadeira, a mensagem original será exibida.
    return message.content;
}
