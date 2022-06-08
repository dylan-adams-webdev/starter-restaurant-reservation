const knex = require('../db/connection');

const listAll = () => {
	return knex('reservations')
		.orderBy('reservation_date', 'reservation_time')
};

/**
 * Return a promise containing all reservations
 */
const listForDate = (date) => {
	return knex('reservations')
		.where({ reservation_date: date })
		.orderBy('reservation_time');
};

const listByPhone = (mobile_number) => {
	return knex('reservations')
		.whereLike('mobile_number', `%${mobile_number}%`);
}

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
	return knex('reservations').where({ reservation_id }).first();
};

const updateStatus = (reservation_id, status) => {
	return knex('reservations')
		.returning('status')
		.where({ reservation_id })
		.update({ status })
		.then((res) => res[0]);
};

const updateReservation = (reservation_id, data) => {
	return knex('reservations')
		.returning('*')
		.where({reservation_id})
		.update(data)
		.then((res) => res[0]);
}

module.exports = {
	listForDate,
	listByPhone,
	listAll,
	create,
	read,
	updateStatus,
	updateReservation
};
