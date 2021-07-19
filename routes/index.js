var express = require('express');
var router = express.Router();

const {download}=require('../controllers/downloadController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/catalog');
});

router.post('/download',download);

module.exports = router;
