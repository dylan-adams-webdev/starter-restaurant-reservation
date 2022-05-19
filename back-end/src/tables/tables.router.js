/**
 * Defines the router for table resources
 */

const controller = require('./tables.controller');
const router = require('express').Router();
const methodNotAllowed = require('../errors/methodNotAllowed');

router.route('/')
	.get(controller.list)
	.post(controller.create)
	.all(methodNotAllowed);

module.exports = router;