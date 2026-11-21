import { apiError } from "../utility/apiError.js"
//Do I know what I"m doing? Half Yes Half No
//Credits to StackOverflow for the pickDefined function and a bunch of other shit (gikawat yawa hahahahhaha)
//Credits to ChatGPT for suggestions on what was missing and fixing requireEnum and requireAmount
export function requireText(value, fieldName, maxLength = 100) {
    if (typeof value !== "string" || !value.trim()) {
        throw new apiError(400, `${fieldName} is required.`);
    }
    if (value.trim().length > maxLength) {
        throw new apiError(400, `${fieldName} must be <= ${maxLength}`);
    }
    return value.trim();
}

export function requireAmount(value, fieldName = "Amount") {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new apiError(400, `${fieldName} must be < 0`);
    }
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function requireEnum(value, allowedValues, fieldName) {
    const normalized = String(value ?? "").toUpperCase();
    if (!allowedValues.includes(normalized)) {
        throw new apiError(400, `${fieldName} must be one of: ${allowedValues.join(", ")}`);
    }
    return normalized;
}

export function optionalDate(value, fieldName) {
    if (value === undefined || value === null || value === "") return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new apiError(400, `${fieldName} must be a valud date`);
    }
    return date.toISOString();
}

export function requiredDate(value, fieldName) {
    const date = optionalDate(value, fieldName);
    if (!date) throw new apiError(400, `${fieldName} is required`);
    return date;
}
export function requireBoolean(value, fieldName) {
    if (typeof value !== "boolean") {
        throw new apiError(400, `${fieldName} must be a boolean DUH`);
    }
    return value;
}

export function requireContext(value = "PERSONAL") {
    return requireEnum(value, ["PERSONAL", "BUSINESS"], "Financial context");
}

export function pickDefined(source, keys) {
    return Object.fromEntries(
        keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]])
    );
}

