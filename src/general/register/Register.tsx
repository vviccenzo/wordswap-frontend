import React, { useState } from 'react';
import { Layout, Form, Input, Button, Upload, message } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined, UploadOutlined } from '@ant-design/icons';
import { HttpMethods } from '../../utils/IRequest.ts';
import { Notification } from '../../utils/Notification.tsx';
import { useNavigate } from 'react-router-dom';

import img1 from '../../imgs/logo.png';
import doRequest from '../../utils/Request.ts';

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
            formData.append('file', fileList[0].originFileObj);
            formData.append('name', form.getFieldValue("name"));

            doRequest({
                method: HttpMethods.POST,
                url: '/user',
                data: formData,
                successCallback: () => {
                    navigate('/login')
                    Notification({ message: 'Sucesso', description: "Conta criada com sucesso", placement: 'top', type: "success" });
                },
                errorCallback: (error) => {
                    Notification({ message: 'Erro', description: error, placement: 'top', type: "error" });
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
                message.error('Você só pode enviar arquivos JPG/PNG!');
            }

            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('A imagem deve ser menor que 2MB!');
            }

            return isJpgOrPng && isLt2M;
        },
        onChange: handleUploadChange,
        fileList,
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Sider width="30%" style={{ backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '8%' }}>
                <img width={200} src={img1} alt="Logo do site" style={{ marginLeft: 50 }} />
                <Form
                    name="register"
                    onFinish={onFinish}
                    style={{ width: '300px' }}
                    scrollToFirstError
                    form={form}
                >
                    {step === 1 && (
                        <>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                            >
                                <Input placeholder="Usuário" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '- Por favor, insira sua senha!',
                                    },
                                    {
                                        min: 8,
                                        message: '- A senha deve ter pelo menos 8 caracteres!',
                                    },
                                    {
                                        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                                        message: '- A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password placeholder="Senha" />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, confirme sua senha!',
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
                                <Input.Password placeholder="Confirmar Senha" />
                            </Form.Item>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Form.Item>
                                <Upload {...uploadProps} listType="picture">
                                    <Button icon={<UploadOutlined />}>Carregar Avatar</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'O email não é válido!',
                                    },
                                    {
                                        required: true,
                                        message: 'Por favor, insira seu email!',
                                    },
                                ]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="confirmEmail"
                                dependencies={['email']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Por favor, confirme seu email!',
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
                            >
                                <Input placeholder="Confirmar Email" />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    placeholder="Nome"
                                    name="name"
                                    rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                                />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            {step === 1 && (
                                <Button
                                    type="default"
                                    onClick={() => setStep(2)}
                                    style={{ width: 100, backgroundColor: "#1A1818", color: 'white' }}
                                >
                                    Cancelar
                                </Button>
                            )}
                            {step === 2 && (
                                <Button
                                    type="default"
                                    onClick={() => setStep(1)}
                                    style={{ width: 100 }}
                                >
                                    <DoubleLeftOutlined />
                                </Button>
                            )}
                            <Button type="primary" htmlType="submit" style={{ width: 150, backgroundColor: '#cccccc', color: 'black', border: 'none', boxShadow: 'none' }}>
                                {step === 1 ? <DoubleRightOutlined /> : 'Salvar'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
                <div style={{ marginLeft: 55 }}>
                    <span>
                        Já é cadastrado? Efetue o &nbsp;
                    </span>
                    <a href="/login" style={{ color: "#ccc" }}>
                        login
                    </a>
                </div>
            </Sider>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' }} />
        </Layout>
    );
}
