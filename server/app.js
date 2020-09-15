const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoute = require('./api/routes/auth');
const productRoute = require('./api/routes/products');
const categoryRoute = require('./api/routes/category');
const cartRoute = require('./api/routes/carts');
const orderRoute = require('./api/routes/order');
const url = require('url');
const databaseConfig = require('./api/config/database');


mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

mongoose.connect(databaseConfig.url);


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());


const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/category', categoryRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);

app.use(express.static('uploads'));
app.use('/', express.static(__dirname + '/dist/shopping'));

app.use('*', express.static(__dirname + '/dist/shopping'));

app.listen(PORT, () => {
    console.log(`Server listening from ${PORT}.....`);
});
