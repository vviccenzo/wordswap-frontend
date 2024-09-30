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

                setUser({
                    id: data.userInfo.id,
                    profilePic: data.userInfo.profilePic,
                    name: data.userInfo.name,
                    bio: data.userInfo.bio,
                    userCode: data.userInfo.userCode
                });
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
        <Layout className="layout-login">
            <Sider width="30%" className="sider-login">
                <img width={200} src={img1} alt="Logo do site" />
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Por favor, insira seu Usuário' }]}
                        className="login-form-item"
                    >
                        <Input placeholder="Usuário" className="login-input" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Por favor, insira sua Senha' }]}
                        className="login-form-item"
                    >
                        <Input.Password placeholder="Senha" className="login-password-input" />
                    </Form.Item>
                    <Form.Item className="login-form-item">
                        <Button type="primary" htmlType="submit" className="login-btn">
                            Logar
                        </Button>
                    </Form.Item>
                    <Form.Item className="login-form-item">
                        Ou <a href="/register"> registrar-se!</a>
                    </Form.Item>
                </Form>
            </Sider>
            <Content className="content-login" />
        </Layout>
    );
}
