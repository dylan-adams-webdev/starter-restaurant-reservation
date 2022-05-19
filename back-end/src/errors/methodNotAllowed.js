
/**
 * Return an error if an http method is not allowed
 */
module.exports = methodNotAllowed = (req, res, next) => {
	next({
		status: 405,
		message: `${req.method} not allowed for ${req.originalUrl}`,
	});
};
