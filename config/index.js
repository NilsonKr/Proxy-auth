require('dotenv').config();

const config = {
	dev: Boolean(process.env.DEV),
	port: process.env.PORT || 3000,
	apiUrl: process.env.API_URL,
	apiToken: process.env.API_TOKEN,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
	googleClientId: process.env.GOOGLE_CLIENT_ID,
};

module.exports = config;
