const knex = require('../db/connection');

/**
 * Return a promise containing all table objects in db
 * sorted ascending
 */
const list = () => {
	return knex('tables')
		.orderBy('table_name');
}

/**
 * Create new table in db and return promise
 * containing new table_id
 */
const create = (data) => {
	return knex('tables')
		.returning('table_id')
		.insert(data);
}

module.exports = {
	list,
	create
}