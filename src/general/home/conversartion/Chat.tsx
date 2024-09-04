import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';
import { useRequest } from "../../../hook/useRequest.ts";
import { HttpMethods } from '../../../utils/IRequest.ts';
import { Notification } from '../../../utils/Notification.tsx';
import "./Chat.css";
import { ChatHeader } from './chat/ChatHeader.tsx';
import { ChatBody } from './chat/ChatBody.tsx';
import { ChatFooter } from './chat/ChatFooter.tsx';

export function Chat({ setScrollPage, scrollPage, loading, setLoading }: any) {
    const { user } = useUser();
    const { request } = useRequest();
    const { selectedConversation, stompClient, conversations } = useHomeContext();

    const [combinedMessages, setCombinedMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [languageTo, setLanguageTo] = useState<string>('pt');
    const [translationTo, setTranslationTo] = useState<string>('pt');
    const [languageFrom, setLanguageFrom] = useState<string>('pt');
    const [translationFrom, setTranslationFrom] = useState<string>('pt');
    const [translationReceiving, setTranslationReceiving] = useState<boolean>(false);
    const [translationSending, setTranslationSending] = useState(false);

    const handleSend = () => {
        if (message.trim()) {
            const messageData = {
                senderId: user?.id,
                receiverId: user.id === selectedConversation?.receiverId ? selectedConversation?.senderId : selectedConversation?.receiverId,
                conversationId: selectedConversation?.id,
                content: message,
                scrollPage
            };

            stompClient.send('/app/chat/' + selectedConversation?.id, {}, JSON.stringify(messageData));
            setMessage('');
        }
    };

    function configurateTranslation() {
        const data = {
            userId: user?.id,
            conversationId: selectedConversation?.id,
            sendingTranslation: translationTo,
            receivingTranslation: translationFrom,
            isSendingTranslation: translationSending,
            isReceivingTranslation: translationReceiving
        };

        request({
            method: HttpMethods.POST,
            url: '/conversation/configuration',
            data: data,
            successCallback: (data) => {
                setLanguageTo(translationTo.split('-')[0]);
                setLanguageFrom(translationFrom.split('-')[0]);

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
            const userConfig = selectedConversation.configsUser[user.id];
            if (userConfig) {
                setLanguageTo(userConfig.sendingTranslation);
                setLanguageFrom(userConfig.receivingTranslation);

                setTranslationTo(userConfig.sendingTranslation);
                setTranslationFrom(userConfig.receivingTranslation);

                setTranslationReceiving(userConfig.isReceivingTranslation);
                setTranslationSending(userConfig.isSendingTranslation);
            }
        }
    }, [selectedConversation, conversations]);

    return (
        <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#DCDCDC', borderRadius: 20 }}>
            <ChatHeader
                profilePicture={selectedConversation?.profilePic}
                conversationName={selectedConversation?.conversationName}
            />
            <ChatBody
                messages={combinedMessages}
                selectedConversation={selectedConversation}
                setScrollPage={setScrollPage}
                scrollPage={scrollPage}
                loading={loading}
                setLoading={setLoading}
            />
            <ChatFooter
                message={message}
                setMessage={setMessage}
                handleSend={handleSend}
                popoverVisible={popoverVisible}
                setPopoverVisible={setPopoverVisible}
                languageTo={languageTo}
                setLanguageTo={setLanguageTo}
                translationSending={translationSending}
                setTranslationSending={setTranslationSending}
                languageFrom={languageFrom}
                setLanguageFrom={setLanguageFrom}
                translationReceiving={translationReceiving}
                setTranslationReceiving={setTranslationReceiving}
                configurateTranslation={configurateTranslation}
                setTranslationTo={setTranslationTo}
                setTranslationFrom={setTranslationFrom}
            />
        </div>
    );
}
