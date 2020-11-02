const express = require('express');
const LoadService = require('./services/LoadService');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./models/schema');
const MongoClient = require('mongodb').MongoClient;

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
    console.log('App is listening on port 8080.')
    console.log('To get all the data currently stored in the database, go to http://localhost:8000/all.')
    console.log('To upload data into the database, go to http://localhost:8000/upload.')
})

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(function (err) {
    console.log("MONGOdb connected");
    db = client.db("vehicles"); //mongodb database name
});

const resolvers = {
    Query: {
        makes: async () => {
            values = await db.collection('makes').find().toArray().then(res => { return res });
            return values
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready to accept GraphQL requests at ${url}.`);
});