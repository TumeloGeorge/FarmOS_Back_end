const service = require('./finance.service');

exports.connect = (req, res) => {
    const url = `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env.QB_CLIENT_ID}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${process.env.QB_REDIRECT_URI}`;
    res.redirect(url);
};

exports.callback = async (req, res, next) => {
    try {
        if (!req.query.code) {
            throw new Error('MISSING_QB_AUTH_CODE');
        }

        const data = await service.exchangeCode(req.query.code);
        await service.saveTokens(req.user.user_id, data);

        res.json({ message: 'QuickBooks connected' });
    } catch (err) {
        next(err);
    }
};

exports.getTransactions = async (req, res, next) => {
    try {
        const data = await service.getTransactions(req.user.user_id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};
