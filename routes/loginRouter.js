var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('template', { title: 'Login', page: 'login' });
});

router.post('/create', function (
    req,
    res,
    next){
    var username = req.body.username;
    var password = req.body.password;

    if (username && password){
        database.dataQuery(
            'SELECT (username, password) FROM accounts WHERE username = ? AND password = ?',
            onError(),
            onSuccess(),
            [username, password]);
    }

    function onError(results){
        res.send('Error connecting to server');
    }

    function onSuccess(results){
        if (results.length > 0){
            req.session.loggedIn = true;
            req.session.username = username;
            res.redirect('/');
        } else {
            res.send('Username and/or Password are incorrect.');
        }
    }
})

module.exports = router;
