const express = require('express');
const AppController = require('./../controllers/AppController');

const router = express.Router();

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', AppController.prototype.index);
router.get('/all', AppController.prototype.all)
router.get('/schedule/:timeUnit/:number', AppController.prototype.schedule);
router.get('/download', AppController.prototype.download);

module.exports = router;