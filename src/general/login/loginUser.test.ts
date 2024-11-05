import { useUser } from "../../context/UserContext";
import doRequest from "../../utils/Request";
import { loginUser } from "./loginUser";

jest.mock('../../utils/Request');
jest.mock('../../context/UserContext');

beforeAll(() => {
    const localStorageMock = (function () {
        let store = {};
        return {
            getItem(key) {
                return store[key] || null;
            },
            setItem(key, value) {
                store[key] = value.toString();
            },
            removeItem(key) {
                delete store[key];
            },
            clear() {
                store = {};
            },
        };
    })();

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
    });
});

describe('loginUser', () => {
    const setTokenMock = jest.fn();
    const setIsLoggedMock = jest.fn();
    const setUserMock = jest.fn();

    beforeEach(() => {
        (useUser as jest.Mock).mockReturnValue({
            setToken: setTokenMock,
            setIsLogged: setIsLoggedMock,
            setUser: setUserMock,
        });
        jest.clearAllMocks();
    });

    it('deve fazer login com sucesso', async () => {
        (doRequest as jest.Mock).mockResolvedValue({
            token: 'mock-token',
            userInfo: { id: 1, profilePic: '', name: 'User', bio: '', userCode: '' },
        });

        await loginUser('testuser', 'password123');

        expect(doRequest).toHaveBeenCalledWith({
            method: 'POST',
            url: '/auth/login?user=testuser&password=password123',
        });
        expect(setUserMock).toHaveBeenCalledWith({ id: 1, profilePic: '', name: 'User', bio: '', userCode: '' });
        expect(setTokenMock).toHaveBeenCalledWith('mock-token');
        expect(setIsLoggedMock).toHaveBeenCalledWith(true);
    });
});
