const dates = require('date-and-time');
const service = require('./reservations.service');
const common = require('../common/common.service');
const validator = require('../common/validations');
const asyncError = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */
const list = async (req, res, next) => {
	const { date, mobile_number } = req.query;
	let data;
	if (date) {
		data = await service.listForDate(date);
	} else if (mobile_number) {
		data = await service.listByPhone(mobile_number);
	} else {
		data = await service.listAll();
	}
	req.log.debug({ data });
	res.json({ data });
};

/**
 * Validator for mobile_phone property.
 * Must be formatted 'xxx-xxx-xxxx'
 */
const includesValidMobileNumber = (req, res, next) => {
	const { mobile_number } = req.body.data;
	const regex = new RegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/);
	if (regex.test(mobile_number)) return next();
	next({ status: 400, message: 'Mobile phone format incorrect' });
};

/**
 * Validator for reservation_date.
 * Date string must be formatted 'YYYY-MM-DD'.
 */
const reservationDateFormatIsValid = (req, res, next) => {
	const { reservation_date = {} } = req.body.data;
	if (dates.isValid(reservation_date, 'YYYY-MM-DD')) return next();
	next({
		status: 400,
		message: 'reservation_date must be formatted YYYY-MM-DD',
	});
};

/**
 * Validator for reservation_time.
 * Time must be formatted 'HH:MM:SS'
 */
const reservationTimeFormatIsValid = (req, res, next) => {
	const { reservation_time = {} } = req.body.data;
	if (dates.isValid(reservation_time, 'HH:mm:ss')) return next();
	next({
		status: 400,
		message: 'reservation_time must be formatted "HH:mm:ss"',
	});
};

/**
 * Validator for reservation_date and reservation_time.
 * Date and time must both be in the future.
 * Date and time is valid if reservation is at least 1 minute in the future.
 */
const reservationDateIsInFuture = (req, res, next) => {
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
};

/**
 * Ensure reservation is during business hours
 */
const reservationIsValidTimeframe = (req, res, next) => {
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
			'reservation not available at this time: restaurant closed or unavailable',
	});
};

/**
 * ensure reservation party size is a positive integer
 */
const reservationHasValidPartySize = (req, res, next) => {
	const { people = {} } = req.body.data;
	if (Number.isInteger(people) && people > 0) return next();
	next({
		status: 400,
		message: 'people must be integer greater than or equal to 1',
	});
};

const statusIs = (expected) => {
	return (req, res, next) => {
		const { status } = req.body.data;
		if (status === expected) return next();
		next({
			status: 400,
			message: `Status is '${status}' - expected '${expected}'`,
		});
	};
};

/**
 * Create a new reservation in db and return record with id
 */
const create = async (req, res) => {
	const result = await service.create(req.body.data);
	req.log.debug(result);
	res.status(201).json({
		data: { reservation_id: result.reservation_id, ...req.body.data },
	});
};

/**
 * Ensure reservation exists in db
 */
const reservationExists = async (req, res, next) => {
	const reservation = await service.read(req.params.reservationId);
	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}
	next({
		status: 404,
		message: `no record found matching id ${req.params.reservationId}`,
	});
};

/**
 * Return a reservation record from db
 */
const read = (req, res) => {
	res.json({ data: res.locals.reservation });
};

const dataIncludesValidStatus = (req, res, next) => {
	const { status } = req.body.data;
	const validStatuses = ['booked', 'seated', 'finished', 'cancelled'];
	if (validStatuses.includes(status)) {
		return next();
	}
	next({
		status: 400,
		message: `Data has unknown status - valid status = ${validStatuses}`,
	});
};

const reservationIsNotFinished = (req, res, next) => {
	const { status } = res.locals.reservation;
	req.log.debug({ status, url: req.originalUrl });
	if (status !== 'finished') return next();
	next({ status: 400, message: 'Cannot update a finished reservation' });
};

const updateStatus = async (req, res) => {
	const { reservationId } = req.params;
	const { status } = req.body.data;
	const result = await service.updateStatus(reservationId, status);
	req.log.debug(result);
	res.json({ data: { status } });
};

const updateReservation = async (req, res) => {
	const { reservationId } = req.params;
	req.log.debug({ data: req.body.data });
	const {
		first_name,
		last_name,
		mobile_number,
		reservation_date,
		reservation_time,
		people,
	} = req.body.data;
	const newReservation = {
		first_name,
		last_name,
		mobile_number,
		reservation_date,
		reservation_time,
		people,
	};
	const data = await service.updateReservation(reservationId, newReservation);
	res.json({
		data,
	});
};

module.exports = {
	list: asyncError(list),
	create: [
		validator.bodyNotEmpty,
		validator.dataIncludesProp('first_name'),
		validator.dataIncludesProp('last_name'),
		validator.dataIncludesProp('mobile_number'),
		validator.dataIncludesProp('reservation_date'),
		validator.dataIncludesProp('reservation_time'),
		validator.dataIncludesProp('people'),
		includesValidMobileNumber,
		reservationDateFormatIsValid,
		reservationTimeFormatIsValid,
		reservationDateIsInFuture,
		reservationIsValidTimeframe,
		reservationHasValidPartySize,
		statusIs('booked'),
		asyncError(create),
	],
	read: [asyncError(reservationExists), read],
	updateStatus: [
		validator.bodyNotEmpty,
		validator.dataIncludesProp('status'),
		dataIncludesValidStatus,
		asyncError(reservationExists),
		reservationIsNotFinished,
		asyncError(updateStatus),
	],
	updateReservation: [
		reservationExists,
		validator.bodyNotEmpty,
		validator.dataIncludesProp('first_name'),
		validator.dataIncludesProp('last_name'),
		validator.dataIncludesProp('mobile_number'),
		validator.dataIncludesProp('reservation_date'),
		validator.dataIncludesProp('reservation_time'),
		validator.dataIncludesProp('people'),
		includesValidMobileNumber,
		reservationDateFormatIsValid,
		reservationTimeFormatIsValid,
		reservationDateIsInFuture,
		reservationIsValidTimeframe,
		reservationHasValidPartySize,
		asyncError(updateReservation),
	],
};
