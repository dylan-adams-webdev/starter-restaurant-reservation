const dates = require('date-and-time');
const service = require('./reservations.service');
const error = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */
async function list(req, res) {
	let date = req.query.date || dates.format(new Date(), 'YYYY-MM-DD');
	const data = await service.list(date);
	res.json({ data: data });
}

function bodyNotEmpty(req, res, next) {
	if (req.body.data) return next();
	next({ status: 400, message: 'No data in request' });
}

/**
 * Validator for body data.
 * If included prop is missing, respond with error status and message.
 */
function dataIncludesProp(prop) {
	return (req, res, next) => {
		const { data = {} } = req.body;
		console.log('data:', data);
		if (data[prop]) return next();
		return next({ status: 400, message: `Body must include ${prop}` });
	};
}

/**
 * Validator for mobile_phone property.
 * Must be formatted 'xxx-xxx-xxxx'
 */
function includesValidMobileNumber(req, res, next) {
	const { mobile_number } = req.body.data;
	const regex = new RegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/);
	if (regex.test(mobile_number)) return next();
	next({ status: 400, message: 'Mobile phone format incorrect' });
}

/**
 * Validator for reservation_date.
 * Date string must be formatted 'YYYY-MM-DD'.
 */
function reservationDateFormatIsValid(req, res, next) {
	const { reservation_date = {} } = req.body.data;
	if (dates.isValid(reservation_date, 'YYYY-MM-DD')) return next();
	next({
		status: 400,
		message: 'reservation_date must be formatted YYYY-MM-DD',
	});
}

/**
 * Validator for reservation_date.
 * Dat must be in the future and on 
 */

/**
 * Validator for reservation_time.
 * Time must be formatted 'HH:MM:SS'
 */
function reservationTimeFormatIsValid(req, res, next) {
	const { reservation_time = {} } = req.body.data;
	if (dates.isValid(reservation_time, 'HH:mm:ss')) return next();
	next({
		status: 400,
		message: 'reservation_time must be formatted "HH:mm:ss"',
	});
}

function reservationHasValidPartySize(req, res, next) {
	const { people = {} } = req.body.data;
	if (Number.isInteger(people) && people > 0) return next();
	next({
		status: 400,
		message: 'people must be integer greater than or equal to 1',
	});
}

async function create(req, res) {
	const result = await service.create(req.body.data);
	res.status(201).json({
		data: { reservation_id: result, ...req.body.data },
	});
}
module.exports = {
	list: error(list),
	create: [
		bodyNotEmpty,
		dataIncludesProp('first_name'),
		dataIncludesProp('last_name'),
		dataIncludesProp('mobile_number'),
		dataIncludesProp('reservation_date'),
		dataIncludesProp('reservation_time'),
		dataIncludesProp('people'),
		includesValidMobileNumber,
		reservationDateIsValid,
		reservationTimeIsValid,
		reservationHasValidPartySize,
		error(create),
	],
};
