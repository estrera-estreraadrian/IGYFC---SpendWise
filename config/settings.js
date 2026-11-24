export const settings = {
    port: Number(process.env.PORT) || 4000,
    jwtSecret: process.env.JWT_SECRET || 'spendwise-development-secret-change-this',
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '1d',
    recurringCheckIntervalMs: Number(process.env.RECURRING_CHECK_INTERVAL_MS) || 60_000
}