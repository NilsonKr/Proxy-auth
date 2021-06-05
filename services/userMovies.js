const express = require('express');
const config = require('../config/index');
const axios = require('axios').default;
const boom = require('@hapi/boom');

function userMoviesRoutes(app) {
	const router = express.Router();

	app.use(router);

	router.post('/userMovies', async (req, res, next) => {
		const { token } = req.cookies;

		if (!token) {
			next(boom.unauthorized());
		}

		try {
			const { data, status } = await axios({
				method: 'post',
				headers: { Authorization: `Bearer ${token}` },
				url: `${config.apiUrl}/api/userMovies`,
				data: req.body,
			});

			if (status !== 201) {
				next(boom.badRequest());
			}

			res.status(201).json(data);
		} catch (error) {
			next(error);
		}
	});

	router.delete('/userMovies/:userMovieId', async (req, res, next) => {
		const { userMovieId } = req.params;
		const { token } = req.cookies;

		try {
			const { status, data } = await axios({
				method: 'delete',
				headers: { Authorization: `Bearer ${token}` },
				url: `${config.apiUrl}/api/userMovies/${userMovieId}`,
			});

			if (status !== 200) {
				next(boom.badRequest());
			}

			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	});
}

module.exports = userMoviesRoutes;
