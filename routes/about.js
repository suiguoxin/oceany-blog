let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.render('about/index', {});
});

module.exports = router;