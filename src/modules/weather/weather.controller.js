const service = require('./weather.service');

exports.getCurrent = async (req, res, next) => {
    try {
        const location = req.query.location;
        if (!location) {
            return res.status(400).json({ error: 'location query parameter is required' });
        }

        const weather = await service.getCurrentWeather(location);
        res.json(weather);
    } catch (err) {
        next(err);
    }
};
