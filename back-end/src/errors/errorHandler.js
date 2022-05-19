/**
 * Express API error handler.
 */
function errorHandler(err, req, res, next) {
	const { status = 500, message = 'A server error occurred' } = err;
	res.status(status).json({ error: message });
}

module.exports = errorHandler;
