const passport = require('passport');
const lodash = require('lodash');
const { Strategy: TwitterStrategy } = require('passport-twitter');

const config = require('../config/index');
const boom = require('@hapi/boom');
const axios = require('axios').default;

passport.use(
	new TwitterStrategy(
		{
			consumerKey: config.twitterApiKey,
			consumerSecret: config.twitterApiSecret,
			callbackURL: '/auth/twitter-oauth/callback',
			includeEmail: true,
		},
		async (token, tokenSecret, profile, done) => {
			try {
				const { data, status } = await axios({
					method: 'post',
					url: `${config.apiUrl}/api/auth/sign-provider`,
					data: {
						name: profile.username,
						email: lodash.get(profile, 'emails.0.value'),
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
