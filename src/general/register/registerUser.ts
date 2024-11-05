import doRequest from '../../utils/Request';
import { HttpMethods } from '../../utils/IRequest';

export const registerUser = async (values, fileList, navigate, message) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('email', values.email);
    formData.append('name', values.name);

    if (fileList[0]) {
        formData.append('file', fileList[0].originFileObj);
    } else {
        formData.append('file', 'undefined');
    }

    return doRequest({
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
};
