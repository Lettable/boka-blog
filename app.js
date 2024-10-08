require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');
const methodOverride = require('method-override');
const Fs = require('fs');

const app = express();
const PORT = 6455 || process.env.PORT;

// Conncect the db
connectDB();

app.use((req, res, next) => {
    Fs.appendFileSync('logs.txt', `Request Method: ${req.method}, Date: ${new Date()}\n`);
    console.log(`Request Method: ${req.method}, Date: ${new Date()}`)
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});
