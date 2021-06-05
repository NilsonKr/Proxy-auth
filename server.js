const express = require('express');
const config = require('./config/index');
const cookieParser = require('cookie-parser');

const userMoviesRoutes = require('./services/userMovies');
const authRoutes = require('./auth/routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
//routes
authRoutes(app);
userMoviesRoutes(app);

app.listen(config.port, () => {
	console.log(`Magic Happens at http://localhost:${config.port}`);
});
