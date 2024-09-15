import React from 'react';
import { Layout, Form, Input, Button } from 'antd';
import { useUser } from '../../context/UserContext.tsx';

import './style.css';
import img1 from '../../imgs/logo.png';
import doRequest from '../../utils/Request.ts';
import { HttpMethods } from '../../utils/IRequest.ts';
import { Notification } from '../../utils/Notification.tsx';
import { useNavigate } from 'react-router-dom';

const { Content, Sider } = Layout;

export function Login() {

    const { setToken, setIsLogged, setUser } = useUser();
    const navigate = useNavigate();

    const onFinish = (values) => {
        doRequest({
            method: HttpMethods.POST,
            url: '/auth/login?user=' + values.username + '&password=' + values.password,
            successCallback: (data) => {

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.userInfo));

                setUser({ id: data.userInfo.id, profilePic: data.userInfo.profilePic, name: data.userInfo.name, bio: data.userInfo.bio, userCode: data.userInfo.userCode });
                setToken(data.token);
                setIsLogged(true);
                navigate("/home");
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error.error, placement: 'top', type: 'error' });
            }
        });
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Sider width="30%" style={{ backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                <img width={200} src={img1} alt="Logo do site" style={{ margin: 50 }} />
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Por favor, insira seu username' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Por favor, insira sua senha' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: "#1A1818" }}>
                            Logar
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        Ou <a href="/register" style={{ color: "#ccc" }}> registrar-se!</a>
                    </Form.Item>
                </Form>
            </Sider>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' }} />
        </Layout>
    );
}
