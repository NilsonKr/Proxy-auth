const passport = require('passport');
const { OAuth2Strategy } = require('passport-oauth');

const axios = require('axios').default;
const boom = require('@hapi/boom');
const config = require('../config/index');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';

const oAuth2StrategyGoogle = new OAuth2Strategy(
	{
		authorizationURL: GOOGLE_AUTHORIZATION_URL,
		tokenURL: GOOGLE_TOKEN_URL,
		clientID: config.googleClientId,
		clientSecret: config.googleClientSecret,
		callbackURL: '/auth/google-oauth/callback',
	},
	async (accessToken, refreshToken, profile, done) => {
		console.log(profile);

		const { status, data } = await axios({
			method: 'post',
			url: `${config.apiUrl}/api/auth/sign-provider`,
			data: {
				name: profile.name,
				email: profile.email,
				password: profile.id,
				apiToken: config.apiToken,
			},
		});

		if (status !== 201) {
			return done(boom.unauthorized(), false);
		}

		return done(false, data);
	}
);

passport.use('google-oauth', oAuth2StrategyGoogle);
