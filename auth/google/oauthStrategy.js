const passport = require('passport');
const { OAuth2Strategy } = require('passport-oauth');

const axios = require('axios').default;
const boom = require('@hapi/boom');
const config = require('../config/index');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const oAuth2StrategyGoogle = new OAuth2Strategy(
	{
		authorizationURL: GOOGLE_AUTHORIZATION_URL,
		tokenURL: GOOGLE_TOKEN_URL,
		clientID: config.googleClientId,
		clientSecret: config.googleClientSecret,
		callbackURL: '/auth/google-oauth/callback',
	},
	async (accessToken, refreshToken, profile, done) => {
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

		if (status !== 200) {
			return done(boom.unauthorized(), false);
		}

		return done(false, data);
	}
);

oAuth2StrategyGoogle.userProfile = function (accessToken, done) {
	this._oauth2.get(GOOGLE_USERINFO_URL, accessToken, (error, data) => {
		if (error) {
			return done(error);
		}

		try {
			const { sub: id, name, email } = JSON.parse(data);

			done(false, { id, name, email });
		} catch (parsError) {
			return done(parsError);
		}
	});
};

passport.use('google-oauth', oAuth2StrategyGoogle);
