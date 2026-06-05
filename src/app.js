const express = require('express');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('./services/notification.scheduler');

const app = express();

app.use(cors({
    origin: true, // reflect request origin
    credentials: true,    
}));
// Handle preflight requests explicitly
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use('/api', routes);
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});




// Health check (IMPORTANT)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handler (MUST be last)
app.use(errorHandler);

module.exports = app;
