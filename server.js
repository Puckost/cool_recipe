const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const router = require('./app/routes/router');

const connectDB = require('./app/database/connection');

const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// Log requests
app.use(morgan('tiny'));

// Mongodb connection
connectDB();

const cors = require("cors");

var corsOptions = {
	origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
	extended: true
}));


// Parse request to body-parser
app.use(bodyparser.json());

// set view engine
app.set("view engine", "ejs")

// Load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/uploads', express.static(path.resolve(__dirname, "uploads")))

// Load routers
app.use('/', router)

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});

module.exports = app;
