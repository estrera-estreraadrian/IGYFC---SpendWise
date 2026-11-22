import { apiError } from "../utility/apiError.js";
export function setFrequency(value) {
    var date = new Date(value);
    switch (frequency) {
        case 'DAILY':
            date.setDate(date.getDate() + 1);
            break;
        case 'WEEKLY':
            date.setDate(date.getDate() + 7);
            break;
        case 'MONTHLY':
            date.setMonth(date.getMonth() + 1); //Broke Needs Fixing (tldr January 31 +1 motn = impossible february date)
            break;
        case 'YEARLY':
            date.setFullYear(date.getFullYear() + 1); //Broke Needs Fixing
            break;
        default:
            throw new apiError(400, "Bad Request");
    }
    return date.toISOString();
}

export function dateWithin(date, startDate, endDate) {
    var time = new Date(date).getTime();
    return time >= new Date(startDate).getTime() && time <= new Date(endDate).getTime();
}

export function getRange(period, now = new Date()) {

}