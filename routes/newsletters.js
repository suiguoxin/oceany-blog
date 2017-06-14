let express = require('express');
let router = express.Router();

let PostModel = require('../models/posts');

router.get('/', function (req, res) {
    let section = 'newsletters';

    PostModel.getPostsBySection(section)
        .then(function (result) {
            res.render(`newsletters`, {
                posts: result
            });
        });

});

module.exports = router;