const express = require('express');
const router = express.Router();
const database = require('./../modules/database');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
    res.render('template', { title: 'Create an Account', page: 'createAccount' });
});

router.post('/create', function (
    req,
    res,
    next){
    const username = req.body.username;
    const password = req.body.password;

    if (username && password){
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, (error, hash) => {
                const query = {
                    text: "INSERT INTO users(name, pass) VALUES($n, $p)",
                    values: [username, hash]
                };

                database.dataQuery(query, onError, onSuccess)

                function onError(data){
                    console.log("Created user: " + username);
                    req.session.loggedIn = true;
                    req.session.username = username;
                    res.redirect('/');
                }

                function onSuccess(data){
                    console.log("Created user: " + username);
                }
            })
        })
    }
})

module.exports = router;
