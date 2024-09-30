import React from 'react';
import { Avatar, Modal } from "antd";
import { UserOutlined } from '@ant-design/icons';

import './ProfileModal.css';
import { formatDateForSeparator } from '../../../../../../utils/functions/dateUtils.ts';

export function ProfileModal({ user, isModalVisible, handleCancel, userInfo }: any) {

    return (
        <Modal
            title="Usuário"
            visible={isModalVisible}
            onCancel={handleCancel}
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
            className="profile-modal"
        >
            <div className="user-profile">
                <div className="avatar-user-profile">
                    <Avatar
                        size={82}
                        src={user.profilePic}
                        icon={<UserOutlined />}
                        className="avatar-icon"
                    />
                </div>
                <div className="user-info">
                    <div className="info-item">
                        <h5>Nome:</h5>
                        <span className='text-user-profile'>{userInfo.conversationName}</span>
                    </div>

                    <div className="info-item">
                        <h5>Quando entrou no Wordswap:</h5>
                        <span className='text-user-profile'>{formatDateForSeparator(userInfo.createdDate)}</span>
                    </div>

                    <div className="info-item">
                        <h5>Bio:</h5>
                        <span className='text-user-profile'>{userInfo.bio ? userInfo.bio : '-'}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
