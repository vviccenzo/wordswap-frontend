import dayjs from 'dayjs';

export function shouldShowDateSeparator(currentDate, previousDate) {
    if (!previousDate) return true;
    return !dayjs(currentDate).isSame(previousDate, 'day');
}

export function formatDateForSeparator(date) {
    const today = dayjs();
    const messageDate = dayjs(date);

    if (messageDate.isSame(today, 'day')) {
        return 'Hoje';
    } else if (messageDate.isSame(today.subtract(1, 'day'), 'day')) {
        return 'Ontem';
    } else {
        return messageDate.format('DD/MM/YYYY');
    }
}