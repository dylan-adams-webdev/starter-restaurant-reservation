const knex = require('../db/connection');

/**
 * Return a promise containing all reservations
 */
const list = (date) => {
	return knex('reservations')
		.where({ reservation_date: date })
		.orderBy('reservation_time');
};

/**
 * Insert a reservation into the db and return
 * a promise with new reservation_id
 */
const create = (data) => {
	return knex('reservations')
		.returning('reservation_id')
		.insert([data])
		.then((res) => res[0]);
};

module.exports = {
	list,
	create,
};
