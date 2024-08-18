import React from 'react';
import { Modal, Tabs } from 'antd';
import { AddFriendTab } from './tab/AddFriendTab.tsx';
import { FriendsListTab } from './tab/FriendsListTab.tsx';
import { FriendRequestsTab } from './tab/FriendRequestsTab.tsx';
import { useHomeContext } from '../context/HomeContext.tsx';

const { TabPane } = Tabs;

export function FriendshipRequestModal() {

    const { isModalOpen, handleModalStatus } = useHomeContext();

    return (
        <Modal
            title="Amizades"
            centered
            open={isModalOpen}
            onOk={() => handleModalStatus(false)}
            onCancel={() => handleModalStatus(false)}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}
            width={600}
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab="Adicionar Amigos" key="1">
                    <AddFriendTab />
                </TabPane>
                <TabPane tab="Lista de Amigos" key="2">
                    <FriendsListTab />
                </TabPane>
                <TabPane tab="Solicitações" key="3">
                    <FriendRequestsTab />
                </TabPane>
            </Tabs>
        </Modal>
    );
}
