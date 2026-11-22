import { apiError } from "../utility/apiError.js";
export function dayStart(value) {
    var date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date();
}

export function monthStart(value) {
    var date = new Date(value);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date();
}

export function addMonth(value, months) {
    var date = new Date(value);
    var day = date.getDate();

    date.setDate(1);
    date.setMonth(date.getMonth() + months);

    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    date.setDate(Math.min(day, lastDay));
    return date;
}

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
    var currentStart = dayStart(now);
    var previousStart;

    switch (period) {
        case "DAY":
            previousStart = new Date(currentStart);
            previousStart.setDate(previousStart.getDate() - 1);
            break;
        case "WEEK":
            var day = (currentStart.getDay() + 6) % 7;
            currentStart.setDate(currentStart.getDate() - day);
            previousStart = new Date(currentStart);
            previousStart.setDate(previousStart.getDate() - 7);
            break;
        case "MONTH":
            currentStart.setDate(1);
            previousStart = new Date(currentStart);
            previousStart.setMonth(previousStart.getMonth() - 1);
            break;
        case "YEAR":
            currentStart.setMonth(0, 1);
            previousStart = new Date(currentStart);
            previousStart.setFullYear(previousStart.getFullYear() - 1);
            break;
        default:
            throw new apiError(400, "Bad Request:" + period);
    }

    return {
        currentStart: currentStart,
        currentEnd: new Date(now),
        previousStart: previousStart,
        previousEnd: new Date(currentStart.getTime() - 1)
    };
}