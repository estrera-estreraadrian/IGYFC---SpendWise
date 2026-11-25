import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { register, login, getCurrentUser } from '../mainMethods/authentication.js';
import { settings } from "../config/settings.js"
import { store } from "../data/memory.js"
import test, { beforeEach } from "node:test";

beforeEach(function () {
    store.reset();
});

test('register creates a user and returns a signed token without a password hash', async function () {
    const result = await register({ username: 'Tester', email: 'TEST@example.com', password: 'password123' });
    assert.equal(result.user.email, 'test@example.com');
    assert.equal('passwordHash' in result.user, false);
    assert.equal(jwt.verify(result.token, settings.jwtSecret).userId, result.user.id);
});
test('register rejects a duplicate email or username', async function () {
    await register({ username: 'Tester', email: 'test@example.com', password: 'password123' });
    await assert.rejects(register({ username: 'Another', email: 'TEST@example.com', password: 'password123' }), /Already exists/);
});
test('register rejects a password shorter than eight characters', async function () {
    await assert.rejects(register({ username: 'Tester', email: 'test@example.com', password: 'short' }), /Must be 8 or more characters/);
});
test('login accepts valid credentials and returns a token', async function () {
    await register({ username: 'Tester', email: 'test@example.com', password: 'password123' });
    const result = await login({ email: 'TEST@example.com', password: 'password123' });
    assert.ok(result.token); assert.equal(result.user.email, 'test@example.com');
});
test('login rejects an incorrect password', async function () {
    await register({ username: 'Tester', email: 'test@example.com', password: 'password123' });
    await assert.rejects(login({ email: 'test@example.com', password: 'wrongpass' }), /Invalid/);
});
test('getCurrentUser returns the public user record', async function () {
    const result = await register({ username: 'Tester', email: 'test@example.com', password: 'password123' });
    assert.equal(getCurrentUser(result.user.id).username, 'Tester');
});
test('getCurrentUser rejects a missing user', function () {
    assert.throws(function () { return getCurrentUser('missing-user'); }, /Missing/);
});
