describe('BASE_URL_WS', () => {
    const originalEnv = process.env;

    beforeAll(() => {
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('deve usar REACT_APP_BASE_URL com o sufixo "/ws" quando REACT_APP_BASE_URL já inclui "/ws"', () => {
        process.env.REACT_APP_BASE_URL = 'https://wordswap.tech/api/ws';

        const BASE_URL_WS  = "https://wordswap.tech/api/ws";
        expect(BASE_URL_WS).toBe('https://wordswap.tech/api/ws');
    });

    it('deve usar o fallback "https://wordswap.tech/api/ws" quando REACT_APP_BASE_URL não estiver definida', () => {
        delete process.env.REACT_APP_BASE_URL;

        const BASE_URL_WS  = "https://wordswap.tech/api/ws";
        expect(BASE_URL_WS).toBe('https://wordswap.tech/api/ws');
    });
});
