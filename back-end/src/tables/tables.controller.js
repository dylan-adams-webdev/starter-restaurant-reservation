const service = require('./tables.service');
const validator = require('../common/validations');
const asyncError = require('../errors/asyncErrorBoundary');

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
}

/**
 * Create a new table object in db and return inserted 
 * object with row id
 */
const create = async (req, res) => {
	const result = await service.create(req.body.data);
	res.status(201).json({ data: { result, ...req.body.data } });
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
};
