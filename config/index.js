require('dotenv').config();

const config = {
	dev: Boolean(process.env.DEV),
	port: process.env.PORT || 3000,
	apiUrl: process.env.API_URL,
	apiToken: process.env.API_TOKEN,
	sessionSecret: process.env.SESSION_SECRET,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
	googleClientId: process.env.GOOGLE_CLIENT_ID,
	twitterApiKey: process.env.TWITTER_API_KEY,
	twitterApiSecret: process.env.TWITTER_API_SECRET,
	facebookAppId: process.env.FACEBOOK_APP_ID,
	facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
};

module.exports = config;
