import { apiError } from '../utility/apiError.js';
import test from 'node:test';
import assert from 'node:assert/strict';
test('apiError returns an ApiError instance with the correct message and status code', function () {
    const error = new apiError(500, 'Internal Server Error');
    assert.equal(error.message, 'Internal Server Error');
    assert.equal(error.statusCode, 500);
    assert.ok(error instanceof Error);
});
