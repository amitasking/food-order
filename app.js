var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var adminRouter = require('./routes/admin');
var orderRouter = require('./routes/order');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/order', orderRouter);
app.use('/admin', adminRouter);


app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })
