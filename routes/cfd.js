var express = require('express');
var router = express.Router();

router.get('/cfd', function (req, res) {
    res.render('cfd', {
        title: "OCEANY"
    });
});

module.exports = router;