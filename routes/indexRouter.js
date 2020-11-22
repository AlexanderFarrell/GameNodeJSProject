var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('template', { title: 'Home', page: 'index' });
});

module.exports = router;
