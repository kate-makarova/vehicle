const express = require('express');
const LoadService = require('./services/LoadService');
const xml2js = require('xml2js');

const app = express();
const router = express.Router();

const port = 8080;

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', async function(req,res){
    try {
        var loadService = new LoadService();
      //  var xml = await importService.loadURL('https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/440?format=xml');
      // var xml = await importService.loadUrlChunk('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML', 0, 500000);
      // console.log(xml);
      // res.html(xml);
        // Since this file potentially can be quite large, we need a way to process it in chunks.
        // The easiest way is to first download it locally and then parse it.
      //  await loadService.loadUrlToFile('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML');
        loadService.loadFileChunk(0);
        res.json({status: 'ready'});

        // var parser = xml2js.Parser();
        // var text = await new Promise((resolve, reject) => parser.parseString(xml, (err, data) => {
        //     if (err) reject(err);
        //     resolve(data);
        // }));
       // res.json(text);
    } catch(e) {
        res.json({status: 'error'});
    }
});

router.get('/sharks', function(req,res){
    res.json({b: 2});
});

app.use(express.static('/'));
app.use('/', router);

app.listen(port, function () {
    console.log('Example app listening on port 8080!')
})