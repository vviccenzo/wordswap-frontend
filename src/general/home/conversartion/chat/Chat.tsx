import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../context/UserContext';
import { useHomeContext } from '../../context/HomeContext';
import { useRequest } from "../../../../hook/useRequest";
import { HttpMethods } from '../../../../utils/IRequest';
import { Notification } from '../../../../utils/Notification';
import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType';
import { ChatHeader } from './header/ChatHeader';
import { ChatBody } from './body/ChatBody';
import { ChatFooter } from './footer/ChatFooter';

import './Chat.css';

export function Chat({ setScrollPage, scrollPage, loading, setLoading }: any) {
    const { user } = useUser();
    const { request } = useRequest();
    const { selectedConversation, stompClient, conversations, translationOptions } = useHomeContext();

    const [combinedMessages, setCombinedMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [isReceivedLanguage, setIsReceivedLanguage] = useState<boolean>(false);
    const [isImprovingText, setIsImprovingText] = useState<boolean>(false);
    const [receivedLanguage, setReceivedLanguage] = useState<string>(buildDefaultValueReceivedLanguage());

    useEffect(() => {
        if (selectedConversation) {
            setCombinedMessages(selectedConversation.messages);
            if (selectedConversation.isNewConversation) return;

            const userConfig = selectedConversation.configsUser?.[user.id];
            if (userConfig) {
                setIsImprovingText(userConfig.isImprovingText);
                setIsReceivedLanguage(userConfig.isReceivingTranslation);
            }
        }
    }, [selectedConversation, conversations]);

    useEffect(() => {
        if (translationOptions.length > 0) {
            const userConfig = selectedConversation.configsUser?.[user.id];
            if (userConfig) {
                const translationOption = translationOptions.find(option => option.name === userConfig.receivingTranslation);
                setReceivedLanguage(translationOption?.code || 'pt');
            } else {
                setReceivedLanguage('pt');
            }
        }
    }, [translationOptions]);

    const handleSend = () => {
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

            stompClient.send(`/app/chat/${user.id}`, {}, JSON.stringify(messageRequest));
            setMessage('');
        }
    };

    function buildDefaultValueReceivedLanguage() {
        const userConfig = selectedConversation.configsUser?.[user.id];
        if (userConfig) {
            const translationOption = translationOptions.find(option => option.name === userConfig.receivingTranslation);
            return translationOption?.code || 'pt';
        }
        return 'pt';
    };

    const saveConfiguration = () => {
        const data = {
            userId: user?.id,
            conversationId: selectedConversation?.id,
            receivingTranslation: receivedLanguage,
            isReceivingTranslation: isReceivedLanguage,
            isImprovingText: isImprovingText
        };

        request({
            method: HttpMethods.POST,
            url: '/conversation/configuration',
            data: data,
            successCallback: (data) => {
                setIsReceivedLanguage(data.isReceivingTranslation);
                setReceivedLanguage(data.receivingTranslation);
                setIsImprovingText(data.isImprovingText);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    };

    return (
        <div className="chat-container">
            <div className="chat-header-container">
                <ChatHeader
                    profilePicture={selectedConversation?.profilePic}
                    conversationName={selectedConversation?.conversationName}
                    selectedConversation={selectedConversation}
                />
            </div>
            <div className="chat-body-container">
                <ChatBody
                    messages={combinedMessages}
                    selectedConversation={selectedConversation}
                    setScrollPage={setScrollPage}
                    scrollPage={scrollPage}
                    loading={loading}
                    setLoading={setLoading}
                />
            </div>
            <div className="chat-footer-container">
                <ChatFooter
                    message={message}
                    setMessage={setMessage}
                    handleSend={handleSend}
                    receivedLanguage={receivedLanguage}
                    setReceivedLanguage={setReceivedLanguage}
                    isReceivedLanguage={isReceivedLanguage}
                    setIsReceivedLanguage={setIsReceivedLanguage}
                    isImprovingText={isImprovingText}
                    setIsImprovingText={setIsImprovingText}
                    saveConfiguration={saveConfiguration}
                />
            </div>
        </div>
    );
}