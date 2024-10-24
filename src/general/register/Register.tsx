import React, { useState } from 'react';
import { Layout, Form, Input, Button, Upload, message } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import doRequest from '../../utils/Request';
import "./Register.css";
import { HttpMethods } from '../../utils/IRequest';

const { Content, Sider } = Layout;

export function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [fileList, setFileList] = useState<any[]>([]);
    const form = Form.useForm()[0];

    const onFinish = (values) => {
        if (step === 1) {
            setStep(2);
        } else {
            const formData = new FormData();
            formData.append('username', form.getFieldValue("username"));
            formData.append('password', form.getFieldValue("password"));
            formData.append('email', form.getFieldValue("email"));
            formData.append('name', form.getFieldValue("name"));

            if (fileList[0]) {
                formData.append('file', fileList[0].originFileObj);
            } else {
                formData.append('file', 'undefined');
            }

            doRequest({
                method: HttpMethods.POST,
                url: '/user',
                data: formData,
                successCallback: () => {
                    navigate('/login');
                    message.success("Conta criada com sucesso!");
                },
                errorCallback: (error) => {
                    message.error(error);
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Apenas arquivos JPG/PNG!');
            }

            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Imagem deve ter menos que 2MB!');
            }

            return isJpgOrPng && isLt2M;
        },
        onChange: handleUploadChange,
        fileList,
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            <Sider width="30%" className="sider-register">
                <Form
                    name="register"
                    onFinish={onFinish}
                    className="register-form"
                    scrollToFirstError
                    form={form}
                >
                    {step === 1 && (
                        <>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                                className="register-form-item"
                            >
                                <Input placeholder="Usuário" className="register-input" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Por favor, insira sua senha!' },
                                    { min: 8, message: 'A senha deve ter pelo menos 8 caracteres!' },
                                    {
                                        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                                        message: 'A senha deve ter uma letra maiúscula, um número e um caractere especial!'
                                    },
                                ]}
                                hasFeedback
                                className="register-form-item"
                            >
                                <Input.Password placeholder="Senha" className="register-password-input" />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                className="register-form-item"
                                rules={[{
                                    required: true,
                                    message: 'Confirme sua senha!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('As senhas não conferem!'));
                                    },
                                }),
                                ]}
                            >
                                <Input.Password placeholder="Confirmar Senha" className="register-password-input" />
                            </Form.Item>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Form.Item className="register-form-item">
                                <Upload {...uploadProps} listType="picture" className="register-upload">
                                    <Button icon={<UploadOutlined />} className="register-btn-default">Carregar Avatar</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[
                                    { type: 'email', message: 'Email inválido!' },
                                    { required: true, message: 'Insira seu email!' },
                                ]}
                                className="register-form-item"
                            >
                                <Input placeholder="Email" className="register-input" />
                            </Form.Item>
                            <Form.Item
                                name="confirmEmail"
                                dependencies={['email']}
                                rules={[{
                                    required: true,
                                    message: 'Confirme seu email!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('email') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Os emails não conferem!'));
                                    },
                                }),
                                ]}
                                className="register-form-item"
                            >
                                <Input placeholder="Confirmar Email" className="register-input" />
                            </Form.Item>
                            <Form.Item className="register-form-item" name="name">
                                <Input placeholder="Nome" name="name" className="register-input" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {step === 1 && (
                                <a href="/login">
                                    <Button type="default"
                                        className="register-btn-default" onClick={() => setStep(2)} style={{ width: 100, border: '1px solid grey' }}>
                                        Cancelar
                                    </Button>
                                </a>
                            )}
                            {step === 2 && (
                                <Button
                                    type="default"
                                    className="register-btn-default"
                                    onClick={() => setStep(1)}
                                    style={{ width: 100, border: '1px solid white' }}
                                >
                                    <DoubleLeftOutlined />
                                </Button>
                            )}
                            <Button type="primary" htmlType="submit" className="register-btn-primary">
                                {step === 1 ? <DoubleRightOutlined /> : 'Registrar'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Sider>
            <Content style={{ padding: '50px', backgroundColor: 'white' }} />
        </Layout>
    );
}
