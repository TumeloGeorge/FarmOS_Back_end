const axios = require('axios');
const quickbooksConfig = require('../../config/quickbooks');
const repo = require('./finance.repository');

const createAuthHeader = () => {
    return `Basic ${Buffer.from(`${quickbooksConfig.clientId}:${quickbooksConfig.clientSecret}`).toString('base64')}`;
};

exports.exchangeCode = async (code) => {
    const response = await axios.post(
        'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
        new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: quickbooksConfig.redirectUri
        }),
        {
            headers: {
                Authorization: createAuthHeader(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data;
};

exports.refreshAccessToken = async (refreshToken) => {
    const response = await axios.post(
        'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
        {
            headers: {
                Authorization: createAuthHeader(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data;
};

exports.saveTokens = async (userId, data) => {
    const expiresAt = new Date(Date.now() + (data.expires_in * 1000));

    return repo.saveTokens(userId, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        realm_id: data.realmId || data.realm_id,
        expires_at: expiresAt
    });
};

exports.getTransactions = async (userId) => {
    let token = await repo.getToken(userId);
    if (!token) {
        throw new Error('QUICKBOOKS_NOT_CONNECTED');
    }

    const now = new Date();
    if (token.expires_at && new Date(token.expires_at) <= now) {
        const refreshed = await exports.refreshAccessToken(token.refresh_token);
        await exports.saveTokens(userId, refreshed);
        token = await repo.getToken(userId);
    }

    const response = await axios.get(
        `https://quickbooks.api.intuit.com/v3/company/${token.realm_id}/query?query=SELECT * FROM Invoice`,
        {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                Accept: 'application/json'
            }
        }
    );

    return response.data;
};
