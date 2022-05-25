const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const pinoHttp = require('pino-http');
const cors = require('cors');

const errorHandler = require('./errors/errorHandler');
const notFound = require('./errors/notFound');
const reservationsRouter = require('./reservations/reservations.router');
const tablesRouter = require('./tables/tables.router');

const logger = pinoHttp({ prettyPrint: true });

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);
app.use('/reservations', reservationsRouter);
app.use('/tables', tablesRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
