import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../context/UserContext.tsx';
import { useHomeContext } from '../../context/HomeContext.tsx';
import { useRequest } from "../../../../hook/useRequest.ts";
import { HttpMethods } from '../../../../utils/IRequest.ts';
import { Notification } from '../../../../utils/Notification.tsx';
import { WebSocketEventType } from '../../../../utils/enum/WebSocketEventType.ts';
import { ChatHeader } from './header/ChatHeader.tsx';
import { ChatBody } from './body/ChatBody.tsx';
import { ChatFooter } from './footer/ChatFooter.tsx';

import './Chat.css';

export function Chat({ setScrollPage, scrollPage, loading, setLoading }: any) {
    const { user } = useUser();
    const { request } = useRequest();
    const { selectedConversation, stompClient, conversations } = useHomeContext();

    const [combinedMessages, setCombinedMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [languageFrom, setLanguageFrom] = useState<string>('pt');
    const [translationFrom, setTranslationFrom] = useState<string>('pt');
    const [translationReceiving, setTranslationReceiving] = useState<boolean>(false);
    const [isImprovingText, setIsImprovingText] = useState<boolean>(false);

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

            stompClient.send('/app/chat/' + user.id, {}, JSON.stringify(messageRequest));
            setMessage('');
        }
    };

    function configurateTranslation() {
        const data = {
            userId: user?.id,
            conversationId: selectedConversation?.id,
            receivingTranslation: languageFrom,
            isReceivingTranslation: translationReceiving,
            isImprovingText: isImprovingText
        };

        request({
            method: HttpMethods.POST,
            url: '/conversation/configuration',
            data: data,
            successCallback: (data) => {
                if (data.isReceivingTranslation && translationReceiving) {
                    setLanguageFrom(translationFrom.split('-')[0]);
                }

                setIsImprovingText(data.isImprovingText);
                setPopoverVisible(false);
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            }
        });
    }

    useEffect(() => {
        if (selectedConversation) {
            setCombinedMessages(selectedConversation.messages);
            if (selectedConversation.isNewConversartion) {
                return;
            }

            const userConfig = selectedConversation.configsUser[user.id];
            if (userConfig) {
                setIsImprovingText(userConfig.isImprovingText);
                setTranslationReceiving(userConfig.isReceivingTranslation);

                if (userConfig.receivingTranslation && userConfig.receivingTranslation != "") {
                    setTranslationFrom(userConfig.receivingTranslation);
                    setLanguageFrom(userConfig.receivingTranslation);
                }
            }
        }
    }, [selectedConversation, conversations]);

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

                    popoverVisible={popoverVisible}
                    setPopoverVisible={setPopoverVisible}

                    translationFrom={translationFrom}

                    languageFrom={languageFrom}
                    setLanguageFrom={setLanguageFrom}

                    translationReceiving={translationReceiving}
                    setTranslationReceiving={setTranslationReceiving}

                    configurateTranslation={configurateTranslation}
                    setTranslationFrom={setTranslationFrom}

                    isImprovingText={isImprovingText}
                    setIsImprovingText={setIsImprovingText}
                    scrollPage={scrollPage}
                />
            </div>
        </div>
    );
}
