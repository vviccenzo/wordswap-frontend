import { render, screen, fireEvent } from '@testing-library/react';
import { FriendRequestsTab } from './FriendRequestsTab';
import { useHomeContext } from '../../../../context/HomeContext';
import { useUser } from '../../../../../../context/UserContext';

jest.mock('../../../../context/HomeContext');
jest.mock('../../../../../../context/UserContext');

beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
});

describe('FriendRequestsTab', () => {
    const mockStompClient = {
        send: jest.fn(),
    };

    beforeEach(() => {
        (useHomeContext as jest.Mock).mockReturnValue({
            friendRequests: [
                { id: 1, sender: 'User1' },
                { id: 2, sender: 'User2' },
            ],
            stompClient: mockStompClient,
        });
        (useUser as jest.Mock).mockReturnValue({
            user: { id: 123 },
        });
    });

    it('renders friend requests', () => {
        render(<FriendRequestsTab />);

        expect(screen.getByText('User1')).toBeInTheDocument();
        expect(screen.getByText('User2')).toBeInTheDocument();
    });

    it('calls handleChangeStatusRequest with ACCEPTED when accept button is clicked', () => {
        render(<FriendRequestsTab />);

        const acceptButton = screen.getAllByRole('button')[0];
        fireEvent.click(acceptButton);

        expect(mockStompClient.send).toHaveBeenCalledWith(
            '/app/chat/123',
            {},
            JSON.stringify({
                action: 'UPDATE_FRIEND_REQUEST',
                friendshipRequestUpdateDTO: {
                    statusType: 'ACCEPTED',
                    inviteId: 1,
                },
            })
        );
    });

    it('calls handleChangeStatusRequest with DECLINED when decline button is clicked', () => {
        render(<FriendRequestsTab />);

        const declineButton = screen.getAllByRole('button')[1];
        fireEvent.click(declineButton);

        expect(mockStompClient.send).toHaveBeenCalledTimes(2);

        expect(mockStompClient.send.mock.calls[1]).toEqual([
            '/app/chat/123',
            {},
            JSON.stringify({
                action: 'UPDATE_FRIEND_REQUEST',
                friendshipRequestUpdateDTO: {
                    statusType: 'DECLINED',
                    inviteId: 1,
                },
            }),
        ]);
    });

});
