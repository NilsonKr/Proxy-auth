const passport = require('passport');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const axios = require('axios').default;
const boom = require('@hapi/boom');
const config = require('../../config/index');

passport.use(
	new GoogleStrategy(
		{
			clientID: config.googleClientId,
			clientSecret: config.googleClientSecret,
			callbackURL: '/auth/google-oauth/callback',
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

				done(false, data);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);
