const knex = require('../db/connection');

/**
 * Simultaneously update 'tables' table to reflect reservation and 
 * update 'reservations' table with status of reservation
 * if error, do not update anything 
 */
const seatReservation = async (reservation_id, table_id) => {
	return await knex.transaction(trx => {
		return knex('reservations')
			.update({ status: 'seated' })
			.where({ reservation_id })
			.transacting(trx)
			.then(() => {
				return knex('tables')
					.update({ reservation_id })
					.where({ table_id })
					.transacting(trx)
			})
			.then(trx.commit)
			.catch(trx.rollback);
	});
}

const unSeatReservation = async (reservation_id, table_id) => {
	return await knex.transaction(trx => {
		return knex('reservations')
			.update({ status: 'finished' })
			.where({ reservation_id })
			.transacting(trx)
			.then(() => {
				return knex('tables')
					.update({ reservation_id: null })
					.where({ table_id })
					.transacting(trx)
			})
			.then(trx.commit)
			.catch(trx.rollback);
	})	
}

module.exports = {seatReservation, unSeatReservation};