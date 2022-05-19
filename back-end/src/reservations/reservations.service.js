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

/**
 * Return a reservation from db
 */
const read = (reservation_id) => {
	return knex('reservations')
		.where({ reservation_id })
		.first();
}

module.exports = {
	list,
	create,
	read,
};
