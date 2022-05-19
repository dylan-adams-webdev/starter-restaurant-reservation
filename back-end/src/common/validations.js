/**
 * If request body is empty, return 400 status and message
 */
function bodyNotEmpty(req, res, next) {
	if (req.body.data) return next();
	next({ status: 400, message: 'No data in request' });
}

/**
 * Validator for body data.
 * If included prop is missing, respond with error status and message.
 */
function dataIncludesProp(prop) {
	return (req, res, next) => {
		const { data = {} } = req.body;
		console.log('data:', data);
		if (data[prop]) return next();
		return next({ status: 400, message: `Body must include ${prop}` });
	};
}

module.exports = {
	bodyNotEmpty,
	dataIncludesProp
}