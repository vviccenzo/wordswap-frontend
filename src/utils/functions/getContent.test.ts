import getContent from './getContent';

describe('getContent', () => {
    it('deve retornar o conteúdo original da mensagem se configsUser não estiver definido', () => {
        const user = { id: 1 };
        const conv = {};
        const message = { content: 'Mensagem original' };

        const result = getContent(user, conv, message);

        expect(result).toBe('Mensagem original');
    });

    it('deve retornar contentSending se isSendingTranslation estiver ativo e contentSending estiver disponível', () => {
        const user = { id: 1 };
        const conv = {
            configsUser: {
                1: { isSendingTranslation: true }
            }
        };
        const message = {
            content: 'Mensagem original',
            messageContent: { contentSending: 'Conteúdo enviado' }
        };

        const result = getContent(user, conv, message);

        expect(result).toBe('Conteúdo enviado');
    });

    it('deve retornar contentReceiving se isReceivingTranslation estiver ativo e contentReceiving estiver disponível', () => {
        const user = { id: 1 };
        const conv = {
            configsUser: {
                1: { isReceivingTranslation: true }
            }
        };
        const message = {
            content: 'Mensagem original',
            messageContent: { contentReceiving: 'Conteúdo recebido' }
        };

        const result = getContent(user, conv, message);

        expect(result).toBe('Conteúdo recebido');
    });

    it('deve retornar o conteúdo original se isSendingTranslation e isReceivingTranslation estiverem desativados', () => {
        const user = { id: 1 };
        const conv = {
            configsUser: {
                1: { isSendingTranslation: false, isReceivingTranslation: false }
            }
        };
        const message = {
            content: 'Mensagem original',
            messageContent: {
                contentSending: 'Conteúdo enviado',
                contentReceiving: 'Conteúdo recebido'
            }
        };

        const result = getContent(user, conv, message);

        expect(result).toBe('Mensagem original');
    });
});
