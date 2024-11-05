import { message } from 'antd';
import doRequest from '../../utils/Request';
import { registerUser } from './registerUser';

jest.mock('../../utils/Request');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));
jest.mock('antd', () => ({
    message: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('registerUser', () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve cadastrar o usuário com sucesso', async () => {
        const values = {
            username: 'testuser',
            password: 'Password@123',
            email: 'testuser@example.com',
            name: 'Test User',
        };
        const fileList = [{ originFileObj: new Blob() }];
        const doRequestMock = jest.fn().mockImplementation(({ successCallback }) => {
            successCallback(); 
        });

        (doRequest as jest.Mock).mockImplementation(doRequestMock);

        await registerUser(values, fileList, navigateMock, message);

        expect(doRequest).toHaveBeenCalledWith(expect.objectContaining({
            method: 'POST',
            url: '/user',
            data: expect.any(FormData),
        }));
        expect(navigateMock).toHaveBeenCalledWith('/login');
        expect(message.success).toHaveBeenCalledWith("Conta criada com sucesso!");
    });

    it('deve mostrar mensagem de erro ao falhar no cadastro', async () => {
        const values = {
            username: 'testuser',
            password: 'Password@123',
            email: 'testuser@example.com',
            name: 'Test User',
        };
        const fileList = [{ originFileObj: new Blob() }];
        const errorMessage = 'Erro ao cadastrar usuário';

        const doRequestMock = jest.fn().mockImplementation(({ errorCallback }) => {
            errorCallback(errorMessage);
        });

        (doRequest as jest.Mock).mockImplementation(doRequestMock);

        await registerUser(values, fileList, navigateMock, message);

        expect(message.error).toHaveBeenCalledWith(errorMessage);
    });

    it('deve tratar o caso em que não há arquivo enviado', async () => {
        const values = {
            username: 'testuser',
            password: 'Password@123',
            email: 'testuser@example.com',
            name: 'Test User',
        };
        const fileList = [];
        const doRequestMock = jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        });

        (doRequest as jest.Mock).mockImplementation(doRequestMock);

        await registerUser(values, fileList, navigateMock, message);

        expect(doRequest).toHaveBeenCalledWith(expect.objectContaining({
            method: 'POST',
            url: '/user',
            data: expect.any(FormData),
        }));
        expect(navigateMock).toHaveBeenCalledWith('/login');
    });
});
