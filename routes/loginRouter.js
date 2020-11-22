var express = require('express');
var router = express.Router();
const users = require('./../modules/users');

router.get('/', function(req, res, next) {
    res.render('template', { title: 'Login', page: 'login' });
});

router.post('/create', function (
    req,
    res,
    next){
    var username = req.body.username;
    var password = req.body.password;

    users.createUser(username, password, onError, onSuccess);

    function onError(results){
        res.send('Error connecting to server');
    }

    function onSuccess(results){
        if (results.rows > 0){
            req.session.loggedIn = true;
            req.session.username = username;
            res.redirect('/');
        } else {
            res.send('Username and/or Password are incorrect.');
        }
    }
})

module.exports = router;
