var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');

router.get('/', function (req, res) {

    PostModel.getPosts()
        .then(function (result) {
            res.render('cfd', {
                posts: result
            });
        })

});

module.exports = router;