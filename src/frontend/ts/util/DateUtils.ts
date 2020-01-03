import dateformat from 'dateformat';

export const DateUtils = {

    formatDate(date: Date) {
        return dateformat(date, 'ddd dS mmm yyyy, h:mmtt');
    },
}
