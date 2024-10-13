import { fireEvent, render, screen } from '@testing-library/react';
import { WebSocketEventType } from '../../../../../../utils/enum/WebSocketEventType';
import { Notification } from '../../../../../../utils/Notification';
import { HomeContextMock } from '../../../../context/mock/HomeContextMock';
import { AddFriendTab } from './AddFriendTab';
import { MockedUserProvider } from '../../../../../../context/mock/UserContextMock';

jest.mock('../../../../../../utils/Notification');

const mockStompClient = {
    send: jest.fn(),
};

describe('AddFriendTab', () => {
    const user = { id: 123, userCode: 'John Doe', name: 'John Doe', profilePic: 'https://i.pravatar.cc/300', bio: '' };

    const renderWithContext = () => {
        return render(
            <MockedUserProvider>
                <HomeContextMock>
                    <AddFriendTab />
                </HomeContextMock>
            </MockedUserProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('deve renderizar a componente corretamente', () => {
        renderWithContext();

        expect(screen.getByPlaceholderText(/digite o código do usuário/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enviar convite/i })).toBeInTheDocument();
    });

    test('deve atualizar o campo de entrada ao digitar', () => {
        renderWithContext();
        const input: HTMLInputElement = screen.getByPlaceholderText(/digite o código do usuário/i);

        fireEvent.change(input, { target: { value: 'friendCode123' } });

        expect(input.value).toBe('friendCode123');
    });
});
