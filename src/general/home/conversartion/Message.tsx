import React from 'react';
import { List, Typography, Menu, Dropdown } from 'antd';

const { Text } = Typography;

export function Message({ message, isMe }) {


    const menu = (
        <Menu>
            <Menu.Item key="edit" onClick={() => handleMenuClick('edit')}>
                Editar mensagem
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleMenuClick('delete')}>
                Apagar mensagem
            </Menu.Item>
        </Menu>
    );

    const handleMenuClick = (key) => {
        if (key === 'edit') {
            console.log(key);
        } else if (key === 'delete') {
            console.log(key);
        }
    };

    return (
        <List.Item
            style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
                marginRight: isMe ? 10 : '0',
            }}
        >
            <Dropdown
                overlay={menu}
                trigger={['contextMenu']}
            >
                <div
                    style={{
                        background: isMe ? '#dcf8c6' : '#fff',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        maxWidth: '60%',
                        wordBreak: 'break-word',
                    }}
                >
                    <div className="message-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Text style={{ marginRight: '10px' }}>{message.content}</Text>
                        <span style={{
                            fontSize: '10px',
                            color: '#888',
                            flexShrink: 0,
                            marginBottom: '1px',
                        }}>
                            {message.timestamp}
                        </span>
                    </div>
                </div>
            </Dropdown>
        </List.Item>

    );
}
