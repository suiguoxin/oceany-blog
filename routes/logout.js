let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    //许多用户同时登录时如何运行？？
    req.session.user = null;
    req.flash('success', 'log out succeed');

    res.redirect('index');
});

module.exports = router;