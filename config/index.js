require('dotenv').config();

const config = {
	dev: Boolean(process.env.DEV),
	port: process.env.PORT || 3000,
	apiUrl: process.env.API_URL,
	apiToken: process.env.API_TOKEN,
};

module.exports = config;
