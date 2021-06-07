const passport = require('passport');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const axios = require('axios').default;
const boom = require('@hapi/boom');
const config = require('../config/index');

// const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
// const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
// const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

passport.use(
	new GoogleStrategy(
		{
			clientID: config.googleClientId,
			clientSecret: config.googleClientSecret,
			callbackURL: '/auth/google-oauth/callback',
		},
		async (accessToken, refreshToken, { _json: profile }, done) => {
			const { status, data } = await axios({
				method: 'post',
				url: `${config.apiUrl}/api/auth/sign-provider`,
				data: {
					name: profile.name,
					email: profile.email,
					password: profile.sub,
					apiToken: config.apiToken,
				},
			});

			if (status !== 200) {
				return done(boom.unauthorized(), false);
			}

			return done(false, data);
		}
	)
);
