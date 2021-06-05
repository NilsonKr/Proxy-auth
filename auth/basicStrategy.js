const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const axios = require('axios').default;

const config = require('../config/index');
const boom = require('@hapi/boom');

passport.use(
	new BasicStrategy(async (email, password, cb) => {
		try {
			const { data, status } = await axios({
				method: 'post',
				url: `${config.apiUrl}/api/auth/sign-in`,
				auth: {
					password: password,
					username: email,
				},
				data: {
					apiToken: config.apiToken,
				},
			});

			if (!data || status !== 200) {
				return cb(boom.unauthorized(), false);
			}

			return cb(false, data);
		} catch (error) {
			return cb(error, false);
		}
	})
);
