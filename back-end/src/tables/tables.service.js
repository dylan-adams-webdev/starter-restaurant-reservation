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
		.insert(data)
		.then(res => res[0])
}

/**
 * Find a table by ID in db
 */
const read = (table_id) => {
	return knex('tables')
		.returning('*')
		.where({ table_id })
		.first();
}

const seat = (table_id, reservation_id) => {
	return knex('tables').where({ table_id }).update({ reservation_id });
};

const unSeat = (table_id) => {
	return knex('tables').where({ table_id }).update({ reservation_id: null });
}

module.exports = {
	list,
	create,
	read,
	seat,
	unSeat
}