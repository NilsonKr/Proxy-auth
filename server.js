const express = require('express');
const passport = require('passport');
const config = require('./config/index');

console.log(config);

const app = express();

app.post('/auth/sign-in', (req, res, next) => {});

app.post('/auth/sign-up', (req, res, next) => {});

app.listen(config.port, () => {
	console.log(`Magic Happens at http://localhost:${config.port}`);
});
