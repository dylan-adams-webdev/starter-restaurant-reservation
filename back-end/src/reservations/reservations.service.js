const knex = require('../db/connection');

const list = async (date) => {
	return knex('reservations')
		.where({ reservation_date: date })
		.orderBy('reservation_time');
};

const create = async (data) => {
	return knex('reservations')
		.returning('reservation_id')
		.insert([data])
		.then((res) => res[0]);
		
};

module.exports = {
	list,
	create,
};
