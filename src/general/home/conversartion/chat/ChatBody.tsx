import React, { useEffect, useRef, useState } from 'react';
import VirtualList, { ListRef } from 'rc-virtual-list';
import { Message } from '../Message.tsx';
import { useHomeContext } from '../../context/HomeContext.tsx';
import { HttpMethods } from '../../../../utils/IRequest.ts';
import { useRequest } from '../../../../hook/useRequest.ts';
import { useUser } from '../../../../context/UserContext.tsx';

import formatTimestamp from '../../../../utils/functions/formatTimestamp.ts';
import mapConversations from '../../../../utils/mapper/conversationMapper.ts';

import './ChatBody.css';
import { formatDateForSeparator, shouldShowDateSeparator } from '../../../../utils/functions/dateUtils.ts';

interface ChatBodyProps {
    messages: any[];
    selectedConversation: any;
    setScrollPage: (page: number) => void;
    scrollPage: number;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

let previousDate = null;
export function ChatBody({ messages, selectedConversation }: ChatBodyProps) {
    const { user } = useUser();
    const { request } = useRequest();
    const { loading, setLoading, setScrollPage, scrollPage, handleConversationSelected, totalMessages } = useHomeContext();
    const [containerHeight, setContainerHeight] = useState<number>(1000);

    const listRef = useRef<ListRef>(null);
    const MESSAGES_PER_PAGE = 10;

    const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(true);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollTop === 0 && !loading && messages.length < totalMessages) {
            setLoading(true);
            setScrollPage(scrollPage + 1);
            getMessages();
        }
    };

    function getMessages() {
        const data = {
            userId: user?.id,
            conversationId: selectedConversation?.id,
            pageNumber: scrollPage,
            pageSize: MESSAGES_PER_PAGE
        };

        request({
            method: HttpMethods.POST,
            url: '/message/get-messages',
            data: data,
            successCallback: (data) => {
                const conv = mapConversations(data, user);

                conv.messages = [
                    ...selectedConversation.messages,
                    ...conv.messages.filter(newMessage =>
                        !selectedConversation.messages.some(oldMessage => oldMessage.id === newMessage.id)
                    )
                ];

                conv.messages.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

                handleConversationSelected(conv);
                setLoading(false);
            },
            errorCallback: (error) => setLoading(false)
        });
    }

    useEffect(() => {
        const updateHeight = () => setContainerHeight(window.innerHeight * 0.8);
        window.addEventListener('resize', updateHeight);
        updateHeight();

        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        if (listRef.current && shouldAutoScroll) {
            listRef.current.scrollTo({ index: messages.length - 1, align: 'bottom' });
        }

        setShouldAutoScroll(true);
    }, [messages, selectedConversation]);

    return (
        <div className="chat-container">
            <VirtualList
                ref={listRef}
                data={messages}
                height={containerHeight}
                itemKey="id"
                onScroll={onScroll}
            >
                {(msg, index) => {
                    const currentDate = msg.timeStamp;
                    const showDateSeparator = shouldShowDateSeparator(currentDate, previousDate);
                    const separatorDate = showDateSeparator ? formatDateForSeparator(currentDate) : null;
                    previousDate = currentDate;

                    return (
                        <Message
                            key={msg.id}
                            message={{
                                id: msg.id,
                                content: msg.content,
                                avatar: msg.sender === 'me' ? null : selectedConversation?.profilePicture,
                                senderName: msg.sender === 'me' ? 'You' : selectedConversation?.conversationName,
                                timestamp: formatTimestamp(msg.timeStamp),
                                isEdited: msg.isEdited,
                                isDeleted: msg.isDeleted,
                                messageContent: msg.messageContent,
                                date: msg.timeStamp
                            }}
                            isMe={msg.sender === 'me'}
                            conv={selectedConversation}
                            showDateSeparator={showDateSeparator}
                            separatorDate={separatorDate}
                        />
                    );
                }}
            </VirtualList>
            {loading && (
                <div className="loading-indicator">
                    <span>Carregando mais mensagens...</span>
                </div>
            )}
        </div>
    );
}
