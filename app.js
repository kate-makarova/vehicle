const express = require('express');
const FileService = require('./services/FileService');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./models/schema');
const MongoClient = require('mongodb').MongoClient;
const VehicleService = require('./services/VehicleService');

const app = express();
const router = express.Router();

const port = 8080;

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', async function(req,res){
    console.log('-1');
    try {
        var loadService = new LoadService();

        // Since this file potentially can be quite large, we need a way to process it in chunks.
        // The easiest way is to first download it locally and then parse it.
      //  await loadService.loadUrlToFile('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML');
      //  loadService.loadFileChunk(0, VehicleService.prototype.callWorker, MongoService.prototype.saveAll);
        res.json({status: 'ready'});


    } catch(e) {
        res.json({status: 'error'});
    }
});

router.get('/upload', async function(req,res){
    try {
        var fileService = new FileService();

       // await fileService.loadUrlToFile('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML');
        fileService.loadFileChunk(VehicleService.prototype.callWorker);

         res.json({"Status": "uploading"});
    } catch(e) {
        res.json({status: 'error'});
    }
});


app.use(express.static('/'));
app.use('/', router);

app.listen(port, function () {
    console.log('App is listening on port 8080.')
    console.log('To get all the data currently stored in the database, go to http://localhost:8080/all.')
    console.log('To upload data into the database, go to http://localhost:8080/upload.')
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