const express = require('express');
const passport = require('passport');
const config = require('./config/index');

const app = express();

// Basic Strategy
require('./auth/basicStrategy');

app.post('/auth/sign-in', (req, res, next) => {
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

				res.cookie('token', token, {
					httpOnly: !config.dev,
					secure: !config.dev,
				});

				res.send(200).json(user);
			});
		} catch (error) {
			next(error);
		}
	})(req, res, next);
});

app.post('/auth/sign-up', (req, res, next) => {});

app.listen(config.port, () => {
	console.log(`Magic Happens at http://localhost:${config.port}`);
});
