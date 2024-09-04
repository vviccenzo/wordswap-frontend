import React, { useEffect, useRef, useState } from 'react';
import VirtualList, { ListRef } from 'rc-virtual-list';
import { Message } from '../Message.tsx';
import { useHomeContext } from '../../context/HomeContext.tsx';
import { HttpMethods } from '../../../../utils/IRequest.ts';
import { useRequest } from '../../../../hook/useRequest.ts';
import { useUser } from '../../../../context/UserContext.tsx';

import dayjs from 'dayjs';
import formatTimestamp from '../../../../utils/functions/formatTimestamp.ts';
import mapConversations from '../../../../utils/mapper/conversationMapper.ts';

interface ChatBodyProps {
    messages: any[];
    selectedConversation: any;
    setScrollPage: (page: number) => void;
    scrollPage: number;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

function shouldShowDateSeparator(currentDate, previousDate) {
    if (!previousDate) return true;
    return !dayjs(currentDate).isSame(previousDate, 'day');
}

function formatDateForSeparator(date) {
    const today = dayjs();
    const messageDate = dayjs(date);

    if (messageDate.isSame(today, 'day')) {
        return 'Hoje';
    } else if (messageDate.isSame(today.subtract(1, 'day'), 'day')) {
        return 'Ontem';
    } else {
        return messageDate.format('DD/MM/YYYY');
    }
}

let previousDate = null;
export function ChatBody({ messages, selectedConversation }: ChatBodyProps) {
    const listRef = useRef<ListRef>(null);

    const [containerHeight, setContainerHeight] = useState(1000);

    const { user } = useUser();
    const { request } = useRequest();

    const { loading, setLoading, setScrollPage, scrollPage, handleConversationSelected } = useHomeContext();

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollTop === 0 && !loading) {
            setLoading(true);
            setScrollPage(scrollPage + 1);
            getMessages();
        }
    };

    function getMessages() {
        const data = {
            userId: selectedConversation?.receiverId,
            conversationId: selectedConversation?.id,
            pageNumber: scrollPage
        }

        request({
            method: HttpMethods.POST,
            url: '/message/get-messages',
            data: data,
            successCallback: (data) => {
                const conv = mapConversations(data, user);
                conv.messages = [...selectedConversation.messages, ...conv.messages];

                handleConversationSelected(conv);
                setLoading(false);
            },
            errorCallback: (error) => {
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        const updateHeight = () => {
            setContainerHeight(window.innerHeight * 0.8);
        };

        window.addEventListener('resize', updateHeight);
        updateHeight();

        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ index: messages.length - 1, align: 'bottom' });
        }
    }, [messages, selectedConversation]);

    return (
        <div className="chat-container">
            <VirtualList
                ref={listRef}
                data={messages}
                height={containerHeight}
                itemHeight={47}
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