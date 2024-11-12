import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Image, Input, List, message, Modal, Steps, Upload } from 'antd';
import { useState } from 'react';
import { WebSocketEventType } from '../../../utils/enum/WebSocketEventType';
import { byteArrayToDataUrl } from '../../../utils/functions/byteArrayToDataUrl';
import { useHomeContext } from '../context/HomeContext';
import { useUser } from '../../../context/UserContext';

const { Step } = Steps;

export default function InviteModal({ visible, onClose }) {

    const { user } = useUser();
    const { friendsList, stompClient } = useHomeContext();

    const [fileList, setFileList] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
    const [groupName, setGroupName] = useState('');
    const [groupBio, setGroupBio] = useState('');
    const [groupPhoto, setGroupPhoto] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(0);

    const handleInvite = () => {
        if (currentStep === 0) {
            setCurrentStep(1);
        } else if (currentStep === 1) {
            if (selectedFriends.length === 0) {
                message.error('Selecione pelo menos um amigo para convidar.');
                return;
            }

            if (!groupName) {
                message.error('Por favor, insira o nome do grupo.');
                return;
            }

            onInvite(selectedFriends);
            onClose();
        }
    };

    function onInvite(selectedFriends) {
        const groupData = {
            action: WebSocketEventType.CREATE_GROUP,
            conversationGroupCreateDTO: {
                userIds: [...selectedFriends, user?.id],
                name: groupName,
                bio: groupBio,
            },
        };

        stompClient.send(`/app/chat/${user?.id}`, {}, JSON.stringify(groupData));
    }

    const handleCheckboxChange = (friendId: string, checked: boolean) => {
        setSelectedFriends((prev) =>
            checked
                ? [...prev, friendId]
                : prev.filter((id) => id !== friendId)
        );
    };

    const handleUploadChange = ({ file }: any) => {
        if (file && file.originFileObj) {
            const isValidFile = validateFile(file.originFileObj);
            if (!isValidFile) {
                setFileList([]);
                return;
            }

            setFileList([file]);

            const reader = new FileReader();
            reader.onloadend = () => setGroupPhoto(reader.result as string);
            try {
                reader.readAsDataURL(file.originFileObj);
            } catch (error) {
                message.error('Erro ao processar a imagem. Tente novamente.');
            }
        } else {
            message.error('Arquivo inválido. Por favor, selecione uma imagem válida.');
        }
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isValid = validateFile(file);
            if (!isValid) return false;
            return true;
        },
        onChange: handleUploadChange,
        fileList,
        onRemove: () => {
            setFileList([]);
            setGroupPhoto(null);
        },
        onDrop: () => {
            setFileList([]);
            setGroupPhoto(null);
        },
    };

    const validateFile = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 2048 / 2048 < 4;

        if (!isJpgOrPng) message.error('Você só pode enviar arquivos JPG/PNG!');
        if (!isLt2M) message.error('A imagem deve ser menor que 2MB!');

        return isJpgOrPng && isLt2M;
    };

    return (
        <Modal
            title="Convide Amigos para o Chat em Grupo"
            visible={visible}
            onCancel={onClose}
            onOk={handleInvite}
            okText={currentStep === 0 ? "Próximo" : "Criar Grupo"}
            cancelText="Cancelar"
            width={600}
        >
            <Steps current={currentStep} onChange={setCurrentStep} size="small">
                <Step title="Detalhes do Grupo" />
                <Step title="Convidar Amigos" />
            </Steps>

            {currentStep === 0 && (
                <div style={{ marginBottom: '20px' }} className="avatar-container">
                    {fileList.length > 0 && (
                        <div className="avatar-preview">
                            <Image
                                src={URL.createObjectURL(fileList[0].originFileObj)}
                                style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <Upload {...uploadProps} className="register-upload">
                        <Button icon={<UploadOutlined />} className="register-btn-default">Carregar Avatar</Button>
                    </Upload>
                    <Input
                        placeholder="Nome do grupo"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        style={{ marginBottom: '10px', marginTop: '10px' }}
                    />
                    <Input.TextArea
                        placeholder="Bio do grupo"
                        value={groupBio}
                        onChange={(e) => setGroupBio(e.target.value)}
                        rows={4}
                        style={{ marginBottom: '10px' }}
                    />
                </div>
            )}

            {currentStep === 1 && (
                <List
                    dataSource={friendsList}
                    renderItem={(friend: any) => (
                        <List.Item
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '8px',
                                transition: 'background-color 0.2s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            <Checkbox
                                checked={selectedFriends.includes(friend.id)}
                                onChange={(e) => handleCheckboxChange(friend.id, e.target.checked)}
                                style={{
                                    marginRight: '10px'
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>{friend.label}</span>
                                <Avatar
                                    size={48}
                                    icon={<UserOutlined />}
                                    className="avatar"
                                    src={friend?.profilePic?.length > 0 ? byteArrayToDataUrl(friend.profilePic) : ''}
                                />
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
}
