// formatTimestamp.test.js

import formatTimestamp from "../functions/formatTimestamp";

describe('formatTimestamp', () => {
    test('should format timestamp correctly', () => {
        const timestamp = new Date('2024-10-06T14:30:00Z').getTime();
        const expectedResult = '11:30';
        const result = formatTimestamp(timestamp);
        expect(result).toBe(expectedResult);
    });

    test('should handle single digit hours and minutes', () => {
        const timestamp = new Date('2024-10-06T05:07:00Z').getTime();
        const expectedResult = '02:07';
        const result = formatTimestamp(timestamp);
        expect(result).toBe(expectedResult);
    });

    test('should handle midnight correctly', () => {
        const timestamp = new Date('2024-10-06T00:00:00Z').getTime();
        const expectedResult = '21:00';
        const result = formatTimestamp(timestamp);
        expect(result).toBe(expectedResult);
    });

    test('should handle 20:59 correctly', () => {
        const timestamp = new Date('2024-10-06T23:59:00Z').getTime(); // One minute before midnight
        const expectedResult = '20:59';
        const result = formatTimestamp(timestamp);
        expect(result).toBe(expectedResult);
    });
});
