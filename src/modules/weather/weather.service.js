const axios = require('axios');
const openweatherConfig = require('../../config/openweather');

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

exports.getCurrentWeather = async (location) => {
    if (!openweatherConfig.apiKey) {
        throw new Error('Missing OPENWEATHER_API_KEY environment variable');
    }

    const response = await axios.get(BASE_URL, {
        params: {
            q: location,
            appid: openweatherConfig.apiKey,
            units: 'metric',
        },
    });

    const data = response.data;

    return {
        location: `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ''}`,
        temperature: data.main?.temp,
        condition: data.weather?.[0]?.main,
        description: data.weather?.[0]?.description,
        humidity: data.main?.humidity,
        pressure: data.main?.pressure,
        windSpeed: data.wind?.speed,
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
        raw: data,
    };
};
