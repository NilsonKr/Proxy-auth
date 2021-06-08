const express = require('express');
const passport = require('passport');
const axios = require('axios').default;
const config = require('../config/index');
const boom = require('@hapi/boom');

// Basic Strategy
require('./basicStrategy');

// Google OAuth Strategy

require('./google/openidConnect');

// Twitter OAuth Strategy

require('./twitter/twitterStrategy');

//Facebook OAuth Strategy

require('./facebook/facebookStrategy');

function authRoutes(app) {
	const router = express.Router();
	app.use('/auth', router);

	//Start auth procces with google
	router.get(
		'/google-oauth',
		passport.authenticate('google', { scope: ['email', 'profile', 'openid'] })
	);

	//Callback Url
	router.get(
		'/google-oauth/callback',
		passport.authenticate('google', { session: false }),
		(req, res, next) => {
			if (!req.user) {
				next(boom.unauthorized());
			}

			const { token, user } = req.user;

			res.cookie('token', token, {
				httpOnly: !config.dev,
				secure: !config.dev,
			});

			res.status(200).json(user);
		}
	);

	//Start OAuth with Twitter
	router.get('/twitter-oauth', passport.authenticate('twitter'));

	//Callback OAuth twitter

	router.get(
		'/twitter-oauth/callback',
		passport.authenticate('twitter', { session: false }),
		(req, res, next) => {
			if (!req.user) {
				next(boom.unauthorized());
			}

			const { token, user } = req.user;

			res.cookie('token', token, {
				httpOnly: !config.dev,
				secure: !config.dev,
			});

			res.status(200).json(user);
		}
	);

	//Start OAuth with Facebook

	router.get('/facebook-oauth', passport.authenticate('facebook', { scope: ['email'] }));

	//Callback Facebook OAuth

	router.get(
		'/facebook-oauth/callback',
		passport.authenticate('facebook', { session: false }),
		(req, res, next) => {
			if (!req.user) {
				next(boom.unauthorized());
			}

			const { token, user } = req.user;

			res.cookie('token', token, {
				httpOnly: !config.dev,
				secure: !config.dev,
			});

			res.status(200).json(user);
		}
	);

	router.post('/sign-in', (req, res, next) => {
		passport.authenticate('basic', (error, data) => {
			if (error) {
				next(error);
			}
			try {
				const { token, user } = data;

				req.login(user, { session: false }, err => {
					if (err) {
						next(err);
					}

					//Set Cookie with the token in
					res.cookie('token', token, {
						httpOnly: !config.dev,
						secure: !config.dev,
					});

					res.status(200).json(user);
				});
			} catch (error) {
				next(error);
			}
		})(req, res, next);
	});

	router.post('/sign-up', async (req, res, next) => {
		try {
			await axios({
				method: 'post',
				data: { ...req.body },
				url: `${config.apiUrl}/api/auth/sign-up`,
			});

			res.status(201).json({ message: 'User Created!' });
		} catch (error) {
			next(error);
		}
	});
}

module.exports = authRoutes;
