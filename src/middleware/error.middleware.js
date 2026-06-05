module.exports = (err, req, res, next) => {

    console.error('Error:', err.message);

    if (err.message === 'TASK_NOT_FOUND') {
        return res.status(404).json({ error: err.message });
    }

    if (err.message === 'User already exists') {
        return res.status(409).json({ error: err.message });
    }

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        error: message
    });
};
