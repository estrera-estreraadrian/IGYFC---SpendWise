//npm install bcrypt
//bcrypt node mainMethods/authentication.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { store, createId } from "../data/memory.js"
import { apiError } from "../utility/apiError.js"
import { requireText, optionalDate, requireContext, requireEnum, requireAmount } from "../utility/validation.js";
import { settings } from "../config/settings.js"
const passwordTest = "password"
const hashTest = await bcrypt.hash(passwordTest, 10);

console.log({
    passwordTest,
    hashTest
})

function publicUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
    };
}

export async function register(data) {
    const username = data.username;
    const email = data.email;
    const password = data.password;

    const usernameFix = requireText(username, "Username", 50);
    const emailFix = requireText(email, "Email", 120).toLowerCase();

    if (typeof password !== "string" || password.length < 8) {
        throw new apiError(400, "Must be 8 or more characters");
    }

    const users = store.getAll("users");
    let existing = null;

    for (const user of users) {
        if (user.email === emailFix || user.username.toLowerCase() === usernameFix.toLowerCase()) {
            existing = user;
            break;
        }
    }
    if (existing) {
        throw new apiError(409, "Already exists");
    }
    const user = store.insert("users", {
        id: createId(),
        username: usernameFix,
        email: emailFix,
        passwordHash: await bcrypt.hash(password, 10),
        createdAt: new Date().toISOString()
    });
    return {
        user: publicUser(user),
        token: createToken(user.id)
    };
}

export async function login(data) {
    const email = data.email;
    const password = data.password;

    const emailFix = requireText(email, "Email", 120).toLowerCase();

    const users = store.getAll("users");
    let currentUser = null;

    for (const user of users) {
        if (user.email === emailFix) {
            currentUser = user
            break;
        }
    }

    if (!currentUser || !(await bcrypt.compare(String(password || ""), currentUser.passwordHash))) {
        throw new apiError(401, "Invalid");
    }

    return {
        user: publicUser(currentUser),
        token: createToken(currentUser.id)
    };
}

export function getCurrentUser(userId) {
    const user = store.findById("users", userId);
    if (!user) {
        throw new apiError(401, "Missing");
    }
    return publicUser(user);
}

function createToken(userId) {
    return jwt.sign({ userId: userId }, settings.jwtSecret, { expiresIn: settings.tokenExpiresIn });
}
