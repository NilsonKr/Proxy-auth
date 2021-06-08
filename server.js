const express = require('express');
const passport = require('passport');
const session = require('express-session');
const config = require('./config/index');
const cookieParser = require('cookie-parser');

const userMoviesRoutes = require('./services/userMovies');
const authRoutes = require('./auth/routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	session({ secret: config.sessionSecret, saveUninitialized: false, resave: false })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
authRoutes(app);
userMoviesRoutes(app);

app.listen(config.port, () => {
	console.log(`Magic Happens at http://localhost:${config.port}`);
});
