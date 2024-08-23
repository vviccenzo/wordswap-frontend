import React, { useEffect } from 'react';
import { Menu, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useHomeContext } from '../context/HomeContext.tsx';
import { useUser } from '../../../context/UserContext.tsx';
import { HttpMethods } from '../../../utils/IRequest.ts';
import { Notification } from '../../../utils/Notification.tsx';
import { useRequest } from '../../../hook/useRequest.ts';
import mapConversations from '../../../utils/mapper/conversationMapper.ts';
import * as moment from 'moment';

const { Title, Text } = Typography;

export function ConversationList() {

    const { request } = useRequest();
    const { user } = useUser();

    const { conversations, handleConversations, handleConversationSelected } = useHomeContext();

    useEffect(() => {
        if (user.id) {
            request({
                method: HttpMethods.GET,
                url: '/conversation/load-conversations?userId=' + user.id,
                successCallback: (data) => {
                    const conversationsMapped: any[] = data.map((conversation: any) => {
                        return mapConversations(conversation, user.id);
                    })

                    handleConversations(conversationsMapped);
                },
                errorCallback: (error) => {
                    Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
                }
            });
        }
    }, [user.id]);

    const getLastMessage = (conv) => {
        if (conv && Object.keys(conv.lastMessage).length > 0) {
            const firstKey = Object.keys(conv.lastMessage)[0];
            return conv.lastMessage[firstKey];
        }

        return '';
    };

    const getLastTimeMessage = (conv) => {
        if (conv && Object.keys(conv.lastMessage).length > 0) {
            const timeMessage = Object.keys(conv.lastMessage)[0];

            return moment(timeMessage).format('HH:mm');
        }

        return '';
    };

    return (
        <div style={{ padding: '16px', height: '84.4%', display: 'flex', flexDirection: 'column', backgroundColor: '#DCDCDC' }}>
            <Menu mode="inline" theme="light" style={{ borderRadius: 10 }}>
                {conversations.map((conv) => (
                    <Menu.Item
                        key={conv.id}
                        icon={<UserOutlined
                            style={{
                                width: 30,
                                height: 30,
                                border: '1px solid #777777',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                            }}
                        />}
                        onClick={() => handleConversationSelected(conv)}
                        style={{ height: 55 }}
                    >
                        <div className="ant-menu-title-content" style={{ display: 'flex', flexDirection: 'column', gap: 5, marginLeft: 5 }}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <Title level={5} style={{ margin: 0 }}>{conv.conversationName}</Title>
                                <Text type="secondary" style={{ fontSize: 11, marginTop: 4, marginLeft: 5, fontWeight: 'bold' }}>{getLastTimeMessage(conv)}</Text>
                            </div>
                            <Text type="secondary">{getLastMessage(conv)}</Text>
                        </div>
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};
