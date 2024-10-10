import { byteArrayToBase64ToDataUrl, byteArrayToDataUrl } from "../functions/byteArrayToDataUrl";

describe('Data URL Conversion Functions', () => {
    test('byteArrayToDataUrl should return correct data URL', () => {
        const byteArray = 'your_base64_encoded_string';
        const expectedResult = `data:image/jpeg;base64,${byteArray}`;
        const result = byteArrayToDataUrl(byteArray);
        expect(result).toBe(expectedResult);
    });

    test('byteArrayToBase64ToDataUrl should return correct data URL', () => {
        const byteArray = new Uint8Array([255, 216, 255, 224]);
        const base64String = btoa(String.fromCharCode(...byteArray));
        const expectedResult = `data:image/jpeg;base64,${base64String}`;
        const result = byteArrayToBase64ToDataUrl(byteArray);
        expect(result).toBe(expectedResult);
    });
});
