const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
      info: {
          title: "Shop API",
          description: "Backend Api",
          contact: {
              name: 'Dhirendra Kumawat'
          },
          servers: "http://localhost:3000"
      }
  },
  apis: ["app.js", ".routes/*.js"]
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/* CORS */
app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const orderRouter = require('./routes/order');
//Use Routes
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
