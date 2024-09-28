import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import { Button, Input, Upload, message, Typography, Avatar } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useUser } from "../../../../context/UserContext.tsx";
import { byteArrayToDataUrl } from "../../../../utils/functions/byteArrayToDataUrl.ts";
import { useRequest } from "../../../../hook/useRequest.ts";
import { HttpMethods } from "../../../../utils/IRequest.ts";
import { Notification } from "../../../../utils/Notification.tsx";
import { useHomeContext } from "../../context/HomeContext.tsx";
import "./EditUserModal.css";

const { TextArea } = Input;

export function EditUserModal() {
    const { user, setUser } = useUser();
    const { request } = useRequest();
    const { isEditModalOpen, handleEditModalStatus } = useHomeContext();

    const [bio, setBio] = useState<string>(user.bio || '');
    const [fileList, setFileList] = useState<any>([]);
    const [profileName, setProfileName] = useState<string>(user.name);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [nameInput, setNameInput] = useState<string>(profileName);
    const [imageNew, setImageNew] = useState<any>();

    const hasProfilePicture = user?.profilePic?.length > 0;
    const imageUrl = hasProfilePicture ? byteArrayToDataUrl(user.profilePic) : '';

    useEffect(() => {
        setProfileName(user.name);
    }, [user.name]);

    const handleSave = () => {
        const formData = new FormData();
        formData.append('id', user.id.toString());
        formData.append('name', profileName);
        formData.append('bio', bio);

        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj);
        }

        request({
            method: HttpMethods.PUT,
            url: '/user',
            data: formData,
            successCallback: updateUser,
            errorCallback: handleError,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        handleEditModalStatus(false);
    };

    const updateUser = (data: any) => {
        const updatedUser = {
            id: data.id,
            name: data.label,
            profilePic: data.profilePic,
            bio: data.bio,
            userCode: data.userCode,
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const handleError = (error: string) => {
        Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
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
            reader.onloadend = () => setImageNew(reader.result as string);
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
    };

    const validateFile = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 2048 / 2048 < 4;

        if (!isJpgOrPng) message.error('Você só pode enviar arquivos JPG/PNG!');
        if (!isLt2M) message.error('A imagem deve ser menor que 2MB!');

        return isJpgOrPng && isLt2M;
    };

    const getProfilePicture = () => {
        if (imageNew) return imageNew;
        return hasProfilePicture ? imageUrl : undefined;
    };

    return (
        <Modal
            open={isEditModalOpen}
            onCancel={() => {
                handleEditModalStatus(false);
                setImageNew(undefined);
            }}
            footer={null}
            className="modal-container"
            width={500}
        >
            <div className="modal-body">
                <div className="avatar-container">
                    <Upload {...uploadProps} listType="picture-card" showUploadList={false}>
                        <Avatar
                            size={82}
                            src={getProfilePicture()}
                            icon={<UserOutlined />}
                            className="avatar-icon"
                        />
                    </Upload>
                    <div className="profile-header">
                        {isEditingName ? (
                            <Input
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                onBlur={() => {
                                    setProfileName(nameInput);
                                    setIsEditingName(false);
                                }}
                                onPressEnter={() => {
                                    setProfileName(nameInput);
                                    setIsEditingName(false);
                                }}
                                autoFocus
                                className="profile-name-input"
                            />
                        ) : (
                            <Typography.Title
                                level={4}
                                className="profile-name"
                                onClick={() => setIsEditingName(true)}
                            >
                                {profileName}
                            </Typography.Title>
                        )}
                        <EditOutlined
                            className="edit-icon"
                            onClick={() => setIsEditingName(true)}
                        />
                    </div>
                    <Typography.Text className="user-code">{user.userCode}</Typography.Text>
                </div>
                <TextArea
                    value={bio}
                    placeholder="Biografia..."
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="bio-textarea"
                />
                <div className="button-group">
                    <Button className="cancel-button" onClick={() => handleEditModalStatus(false)}>
                        Cancelar
                    </Button>
                    <Button type="primary" className="save-button" onClick={handleSave}>
                        Salvar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
