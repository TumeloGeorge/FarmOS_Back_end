const db = require('../../db');

exports.saveTokens = async (userId, data) => {
    const existing = await db.query(
        `SELECT id FROM quickbooks_tokens WHERE user_id = $1`,
        [userId]
    );

    if (existing.rows.length > 0) {
        return db.query(
            `UPDATE quickbooks_tokens
             SET access_token = $1,
                 refresh_token = $2,
                 realm_id = $3,
                 expires_at = $4
             WHERE user_id = $5`,
            [data.access_token, data.refresh_token, data.realm_id, data.expires_at, userId]
        );
    }

    return db.query(
        `INSERT INTO quickbooks_tokens (user_id, access_token, refresh_token, realm_id, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, data.access_token, data.refresh_token, data.realm_id, data.expires_at]
    );
};

exports.getToken = async (userId) => {
    const result = await db.query(
        `SELECT * FROM quickbooks_tokens WHERE user_id = $1`,
        [userId]
    );

    return result.rows[0];
};
