import format from 'date-fns/format';

export const convertToCents = price => (price * 100).toFixed(0);
export const convertFromCents = price => (price / 100).toFixed(2);

export const formatProductDate = date => format(date, 'Do MMM, YYYY');

export const formatOrderDate = date => format(date, 'ddd hh:mm, Do MMM, YYYY');
