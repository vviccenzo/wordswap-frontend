import React from 'react';
import { Layout, Divider, Typography } from 'antd';
import { Profile } from './Profile.tsx';

const { Sider, Content } = Layout;
const { Title } = Typography;

const profileData = {
    name: 'John Doe',
    status: 'Online',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
};

export function Home() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={300} style={{ background: '#fff' }}>
                <Profile profileData={profileData} />
                <Divider style={{ color: '#DCDCDC' }} />
            </Sider>
            <Layout style={{ padding: '0 24px', minHeight: '100vh' }}>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: '#fff',
                    }}
                >
                    <Title level={2}>Select a conversation</Title>
                </Content>
            </Layout>
        </Layout>
    );
};
