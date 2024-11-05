const dayjs = require('dayjs');
const {
    shouldShowDateSeparator,
    formatDateForSeparator
} = require('./dateUtils');

describe('shouldShowDateSeparator', () => {
    test('should return true if there is no previous date', () => {
        const currentDate = dayjs('2024-11-05T12:00:00');
        const result = shouldShowDateSeparator(currentDate, null);
        expect(result).toBe(true);
    });

    test('should return true if currentDate is on a different day than previousDate', () => {
        const currentDate = dayjs('2024-11-05T12:00:00');
        const previousDate = dayjs('2024-11-04T23:59:59');
        const result = shouldShowDateSeparator(currentDate, previousDate);
        expect(result).toBe(true);
    });

    test('should return false if currentDate is on the same day as previousDate', () => {
        const currentDate = dayjs('2024-11-05T12:00:00');
        const previousDate = dayjs('2024-11-05T01:00:00');
        const result = shouldShowDateSeparator(currentDate, previousDate);
        expect(result).toBe(false);
    });
});

describe('formatDateForSeparator', () => {
    test('should return "Hoje" if the date is today', () => {
        const today = dayjs();
        const result = formatDateForSeparator(today);
        expect(result).toBe('Hoje');
    });

    test('should return "Ontem" if the date is yesterday', () => {
        const yesterday = dayjs().subtract(1, 'day');
        const result = formatDateForSeparator(yesterday);
        expect(result).toBe('Ontem');
    });

    test('should return formatted date in "DD/MM/YYYY" if the date is older than yesterday', () => {
        const oldDate = dayjs('2024-10-01');
        const result = formatDateForSeparator(oldDate);
        expect(result).toBe('01/10/2024');
    });
});
