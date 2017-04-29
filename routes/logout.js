var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    req.session.user = null;
    req.flash('success', 'log out succeed');

    res.redirect('index');
});

module.exports = router;