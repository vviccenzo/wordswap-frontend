import { Spin } from 'antd';
import VirtualList, { ListRef } from 'rc-virtual-list';
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../../../context/UserContext';
import { useRequest } from '../../../../../hook/useRequest';
import { WebSocketEventType } from '../../../../../utils/enum/WebSocketEventType';
import { formatDateForSeparator, shouldShowDateSeparator } from '../../../../../utils/functions/dateUtils';
import formatTimestamp from '../../../../../utils/functions/formatTimestamp';
import { HttpMethods } from '../../../../../utils/IRequest';
import mapConversations from '../../../../../utils/mapper/conversationMapper';
import { useHomeContext } from '../../../context/HomeContext';
import { Message } from './../../message/Message';
import { ChatBodyProps, GetMessagePayload, Message as MessageType } from './../IChat';

import './ChatBody.css';

const MESSAGES_PER_PAGE = 10;
let previousDate: any = null;

export function ChatBody({ messages, selectedConversation }: ChatBodyProps) {
    const { user } = useUser();
    const { request } = useRequest();
    const { loading, setLoading, setScrollPage, scrollPage, handleConversationSelected, totalMessages, stompClient } = useHomeContext();
    const [containerHeight, setContainerHeight] = useState<number>(1000);
    const listRef = useRef<ListRef>(null);

    useEffect(() => {
        const updateHeight = () => setContainerHeight(window.innerHeight * 0.8);
        window.addEventListener('resize', updateHeight);
        updateHeight();
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        markMessagesAsViewed();
    }, [messages, user?.id]);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollTop === 0 && !loading && messages.length < totalMessages) {
            setLoading(true);
            setScrollPage(scrollPage + 1);
            fetchMessages();
        }
    };

    const fetchMessages = () => {
        const data: GetMessagePayload = {
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
                const updatedConversation = mapConversations(data, user);
                updatedConversation.messages = mergeMessages(selectedConversation.messages, updatedConversation.messages);
                handleConversationSelected(updatedConversation);
                setLoading(false);
            },
            errorCallback: (error) => {
                console.error('Error loading messages', error);
                setLoading(false);
            }
        });
    };

    const mergeMessages = (oldMessages, newMessages) => {
        const mergedMessages = [
            ...oldMessages,
            ...newMessages.filter(newMessage => !oldMessages.some(oldMessage => oldMessage.id === newMessage.id))
        ];
        return mergedMessages.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());
    };

    const markMessagesAsViewed = () => {
        const unviewedMessages = messages.filter(message => message.senderId !== user?.id && !message.viewed);
        const unviewedMessageIds = unviewedMessages.map(message => message.id);

        if (unviewedMessageIds.length > 0) {
            const groupData = {
                action: WebSocketEventType.VIEW_MESSAGE,
                messageViewDTO: { messageIds: unviewedMessageIds },
            };
            stompClient.send(`/app/chat/${user?.id}`, {}, JSON.stringify(groupData));
        }
    };

    return (
        <div className="chat-body">
            {loading && (
                <div className="loading-notification">
                    <Spin size="large" />
                    <span>Carregando mais mensagens...</span>
                </div>
            )}

            <VirtualList
                ref={listRef}
                data={messages}
                height={containerHeight}
                itemKey="id"
                onScroll={onScroll}
            >
                {(msg: MessageType) => {
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
                                timestamp: formatTimestamp(msg.timeStamp),
                                originalContent: msg.originalContent,
                                isEdited: msg.edited,
                                isDeleted: msg.deleted,
                                messageContent: msg.messageContent,
                                date: msg.timeStamp,
                                image: msg.image,
                                senderName: msg.senderName,
                                type: selectedConversation?.type,
                                viewed: msg.viewed,
                                viewedTime: msg.viewedTime
                            }}
                            isMe={msg.sender === 'me'}
                            showDateSeparator={showDateSeparator}
                            separatorDate={separatorDate}
                        />
                    );
                }}
            </VirtualList>
        </div>
    );
}