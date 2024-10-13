import React from 'react';
import { Layout, Form, Input, Button } from 'antd';
import { useUser } from '../../context/UserContext';
import './style.css';
import doRequest from '../../utils/Request';
import { HttpMethods } from '../../utils/IRequest';
import { Notification } from '../../utils/Notification';
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
                    <div style={{ color: 'white' }}>
                        Ou <a href="/register" style={{ color: 'white' }}> registrar-se!</a>
                    </div>
                </Form>
            </Sider>
            <Content className="content-login" />
        </Layout>
    );
}
