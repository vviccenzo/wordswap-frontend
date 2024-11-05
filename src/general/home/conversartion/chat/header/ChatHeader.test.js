const React = require('react');
const ReactDOM = require('react-dom');
const { ChatHeader } = require('./ChatHeader');

global.matchMedia = global.matchMedia || function () {
    return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn()
    };
};

jest.mock('./ProfileModal/ProfileModal', () => {
    return {
        ProfileModal: ({ isModalVisible }) => (
            isModalVisible ? React.createElement('div', { 'data-testid': 'profile-modal' }, 'Profile Modal') : null
        )
    };
});

const mountComponent = (props) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(React.createElement(ChatHeader, props), div);
    return div;
};

describe('ChatHeader', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('should render avatar with image when profilePicture is provided', () => {
        const profilePicture = new Uint8Array([]);
        const conversationName = "Teste de Conversa";

        const div = mountComponent({
            profilePicture: profilePicture,
            conversationName: conversationName,
            selectedConversation: {}
        });

        const avatar = div.querySelector('img');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('src');
    });
});
