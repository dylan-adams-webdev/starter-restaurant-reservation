const service = require('./tables.service');
const validator = require('../common/validations');
const asyncError = require('../errors/asyncErrorBoundary');
const reservationService = require('../reservations/reservations.service');
const commonService = require('../common/common.service');

/**
 * Ensure table_name is between 2 and 255 characters in length
 */
const tableNameIsFullLength = (req, res, next) => {
	const { table_name } = req.body.data;
	if (table_name.length > 1 && table_name.length <= 255) return next();
	next({
		status: 400,
		message: 'table_name value should be at least 2 characters long',
	});
};

/**
 * Ensure table capacity is a positive integer
 */
const tableCapacityIsInteger = (req, res, next) => {
	const { capacity } = req.body.data;
	if (Number.isInteger(capacity) && capacity > 0) return next();
	next({ status: 400, message: 'table capacity must be integer at least 1' });
};

/**
 * List all table objects in db
 */
const list = async (req, res) => {
	const data = await service.list();
	res.json({ data: data });
};

/**
 * Create a new table object in db and return inserted
 * object with row id
 */
const create = async (req, res) => {
	const result = await service.create(req.body.data);
	req.log.warn({ data: { table_id: result, ...req.body.data } });
	res.status(201).json({ data: { table_id: result.table_id, ...req.body.data } });
};

const getReservation = async (req, res, next) => {
	let reservation_id = req.body.data?.reservation_id;
	if (!reservation_id) reservation_id = res.locals.table.reservation_id;
	const result = await reservationService.read(reservation_id);
	if (result) {
		res.locals.reservation = result;
		return next();
	}
	next({
		status: 404,
		message: `Reservation with ID ${reservation_id} does not exist`,
	});
};

const tableExists = async (req, res, next) => {
	const result = await service.read(req.params.tableId);
	if (result) {
		res.locals.table = result;
		return next();
	}
	next({
		status: 404,
		message: `table with ID ${req.params.tableId} does not exist`,
	});
};

const tableHasCapacity = (req, res, next) => {
	const { table, reservation } = res.locals;
	if (table.capacity < reservation.people) {
		return next({
			status: 400,
			message: `Table does not have sufficient capacity for party size`,
		});
	}
	next();
};

const tableIsFree = (req, res, next) => {
	const { table } = res.locals;
	if (!table.reservation_id) return next();
	next({ status: 400, message: 'Table is already occupied' });
};

const statusAvailableToChange = (req, res, next) => {
	const { reservation } = res.locals;
	if (reservation.status !== 'finished' && reservation.status !== 'seated')
		return next();
	return next({
		status: 400,
		message: 'Reservation is already seated or finished',
	});
};

const tableIsOccupied = (req, res, next) => {
	const { table } = res.locals;
	req.log.debug({ occupied: !!table.reservation_id, table: table });
	if (table.reservation_id) return next();
	next({ status: 400, message: 'Table is not occupied' });
};

const seat = async (req, res) => {
	const { reservation, table } = res.locals;
	await commonService.seatReservation(
		reservation.reservation_id,
		table.table_id
	);
	req.log.debug({
		seated: {
			reservation_id: reservation.reservation_id,
			table_id: table.table_id,
			status: 'seated',
		},
	});
	res.json({data: {status: 'seated'}});
};

const finish = async (req, res) => {
	const { tableId } = req.params;
	const { reservation } = res.locals;
	await commonService.unSeatReservation(reservation.reservation_id, tableId);
	res.sendStatus(200);
};

module.exports = {
	list: asyncError(list),
	create: [
		validator.bodyNotEmpty,
		validator.dataIncludesProp('table_name'),
		validator.dataIncludesProp('capacity'),
		tableNameIsFullLength,
		tableCapacityIsInteger,
		asyncError(create),
	],
	seat: [
		validator.bodyNotEmpty,
		validator.dataIncludesProp('reservation_id'),
		asyncError(tableExists),
		asyncError(getReservation),
		tableHasCapacity,
		tableIsFree,
		statusAvailableToChange,
		asyncError(seat),
	],
	finish: [
		asyncError(tableExists),
		tableIsOccupied,
		asyncError(getReservation),
		asyncError(finish),
	],
};
