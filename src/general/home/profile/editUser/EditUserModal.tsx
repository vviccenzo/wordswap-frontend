import React, { useState } from "react";
import Modal from "antd/es/modal/Modal";

import { useHomeContext } from "../../context/HomeContext.tsx";
import { Button, Input, Upload, message, Typography, Avatar } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useUser } from "../../../../context/UserContext.tsx";
import { byteArrayToDataUrl } from "../../../../utils/functions/byteArrayToDataUrl.ts";

import { useRequest } from "../../../../hook/useRequest.ts";
import { HttpMethods } from "../../../../utils/IRequest.ts";
import { Notification } from "../../../../utils/Notification.tsx";

import "./EditUserModal.css";

const { TextArea } = Input;

export function EditUserModal() {

    const { user, setUser } = useUser();
    const { request } = useRequest();

    const { isEditModalOpen, handleEditModalStatus } = useHomeContext();

    const [bio, setBio] = useState<string>(user.bio || '');
    const [fileList, setFileList] = useState<any>([]);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [profileName, setProfileName] = useState<string>(user.name);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [nameInput, setNameInput] = useState<string>(profileName);
    const [hasSelectedImage, setHasSelectedImage] = useState<boolean>(false);
    const [imageNew, setImageNew] = useState<any>();

    const hasProfilePicture = user?.profilePic && user?.profilePic?.length > 0;
    const imageUrl = hasProfilePicture ? byteArrayToDataUrl(user.profilePic) : '';

    function handleSave() {
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
            successCallback: (data) => {
                setUser({
                    id: data.id,
                    name: data.label,
                    profilePic: data.profilePic,
                    bio: data.bio
                });
            },
            errorCallback: (error) => {
                Notification({ message: 'Erro', description: error, placement: 'top', type: 'error' });
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        handleEditModalStatus(false);
    }

    function handleUploadChange({ file }: any) {
        setFileList([file]);
        setHasSelectedImage(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageNew(reader.result as string);
            setIsHovering(false);
        };
        reader.readAsDataURL(file.originFileObj);
    }

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
        <Modal
            open={isEditModalOpen}
            onCancel={() => handleEditModalStatus(false)}
            footer={null}
            className="modal-container"
            width={500}
        >
            <div className="modal-body">
                <div className="avatar-container">
                    <Upload {...uploadProps} listType="picture-card" showUploadList={false}>
                        <div className="upload-avatar">
                            <div
                                style={{ position: 'relative', display: 'inline-block' }}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <Avatar
                                    size={82}
                                    src={hasProfilePicture ? hasSelectedImage ? imageNew : imageUrl : undefined}
                                    icon={isHovering ? <EditOutlined /> : <UserOutlined />}
                                    style={{
                                        cursor: 'pointer',
                                        border: '1px solid #777777',
                                        opacity: isHovering ? 0.8 : 1,
                                        transition: 'opacity 0.3s'
                                    }}
                                    onClick={isHovering ? () => handleEditModalStatus(true) : undefined}
                                />
                            </div>
                        </div>
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
        </Modal >
    );
}
