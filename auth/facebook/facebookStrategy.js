const passport = require('passport');
const { Strategy: FacebookStrategy } = require('passport-facebook');

const axios = require('axios').default;
const boom = require('@hapi/boom');
const config = require('../../config/index');

passport.use(
	new FacebookStrategy(
		{
			clientID: config.facebookAppId,
			clientSecret: config.facebookAppSecret,
			callbackURL: '/auth/facebook-oauth/callback',
			profileFields: ['displayName', 'id', 'email'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const { data, status } = await axios({
					method: 'post',
					url: `${config.apiUrl}/api/auth/sign-provider`,
					data: {
						name: profile.displayName,
						email: profile.emails[0].value,
						password: profile.id,
						apiToken: config.apiToken,
					},
				});

				if (status !== 200) {
					return done(boom.unauthorized(), false);
				}

				return done(false, data);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);
