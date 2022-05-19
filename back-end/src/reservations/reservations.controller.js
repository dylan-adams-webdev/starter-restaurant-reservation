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

/**
 * Validator for reservation_date and reservation_time.
 * Date and time must both be in the future.
 * Date and time is valid if reservation is at least 1 minute in the future.
 */
function reservationDateIsInFuture(req, res, next) {
	const { reservation_date, reservation_time } = req.body.data;
	const resDate = dates.parse(
		`${reservation_date} ${reservation_time}`,
		'YYYY-MM-DD HH:mm:ss'
	);
	const isFuture = dates.subtract(resDate, new Date()).toMinutes() > 0;

	if (isFuture) {
		res.locals.res_datetime_obj = resDate;
		return next();
	}
	next({
		status: 400,
		message: 'reservation_date and reservation_time must be in future',
	});
}

function reservationIsValidTimeframe(req, res, next) {
	const { res_datetime_obj } = res.locals;
	const isBusinessDay = res_datetime_obj.getDay() !== 2;
	const resTime = res_datetime_obj.getTime();
	const isBusinessHours =
		resTime > new Date(res_datetime_obj).setHours(10, 30) &&
		resTime < new Date(res_datetime_obj).setHours(21, 30);
	const isDuringOpenHours = isBusinessDay && isBusinessHours;
	if (isDuringOpenHours) return next();
	next({
		status: 400,
		message:
			'reservation date and time must be between restaurant open and 60 minutes before close',
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
		reservationDateFormatIsValid,
		reservationTimeFormatIsValid,
		reservationDateIsInFuture,
		reservationIsValidTimeframe,
		reservationHasValidPartySize,
		error(create),
	],
};
