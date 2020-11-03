const express = require('express');
const AppController = require('./../controllers/AppController');

const router = express.Router();

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', AppController.prototype.index);
router.get('/all', AppController.prototype.all)
router.get('/upload', AppController.prototype.upload);

module.exports = router;