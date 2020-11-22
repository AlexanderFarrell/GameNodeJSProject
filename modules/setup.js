const express = require('express');
const path = require('path');
const session = require('express-session');

function setupViewEngine(app){
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    console.log("View Engine On");
}

function setupOther(app){
    const cookieParser = require('cookie-parser');
    const logger = require('morgan');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));
    console.log("Generic Express Things On");
}

function setupSecurity(app){
    const helmet = require('helmet');
    const compression = require('compression');
    const rateLimit = require('express-rate-limit');
    //const {body, check} = require('express-validator');

    app.use(compression());
    app.use(helmet());
    const limiter = rateLimit({
        windowMs: 60 * 1000, //1 Minute
        max: 150
    })
    app.use(limiter);
    console.log("Security On");
}

function setupSessions(app){
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));
    console.log("Sessions on");
}

function setupRouters(app){
    const createAccountRouter = require('../routes/createAccountRouter');
    const indexRouter = require('../routes/indexRouter');
    const loginRouter = require('../routes/loginRouter');

    app.use('/create_account', createAccountRouter);
    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    console.log("Routers On");
}

exports.setupApp = function setupApp(app){
    console.log("- Beginning App Set Up -")
    setupViewEngine(app);
    setupSessions(app);
    setupOther(app);
    setupSecurity(app);
    setupRouters(app);
    console.log("- App On -")
}