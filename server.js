const axios = require('axios').default;
const express = require('express');
const passport = require('passport');
const config = require('./config/index');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

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

app.post('/auth/sign-up', async (req, res, next) => {
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

app.listen(config.port, () => {
	console.log(`Magic Happens at http://localhost:${config.port}`);
});
