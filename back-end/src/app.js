const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const logger = require('../logger');
const expressPino = require('express-pino-logger');
const cors = require('cors');

const errorHandler = require('./errors/errorHandler');
const notFound = require('./errors/notFound');
const reservationsRouter = require('./reservations/reservations.router');
const tablesRouter = require('./tables/tables.router');

const app = express();

const logging = expressPino({
	logger: logger,
	autoLogging: true,
	level: process.env.LOG_LEVEL || 'info',
});

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(logging);

app.use('/reservations', reservationsRouter);
app.use('/tables', tablesRouter);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
