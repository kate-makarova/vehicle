const express = require('express');
const FileService = require('./services/FileService');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./models/schema');
const VehicleService = require('./services/VehicleService');
const MongoService = require('./services/MongoService');
const config = require('./config/config.json');

const app = express();
const router = express.Router();
const mongoService = new MongoService();

const port = process.env.PORT || 8080;

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', function(req,res){
    res.send('<p>To get all the data currently stored in the database, go to http://localhost:8080/all.</p>'+
    '<p>To upload data into the database, go to http://localhost:8080/upload.</p>'+
    '<p>To use Apollo GraphQL user interface go to http://localhost:4000/.</p>')
});

router.get('/all', async function(req,res){
    try {
        res.json(await mongoService.getAll());
    } catch(e) {
        res.json({status: 'error'});
    }
})

router.get('/upload', async function(req,res){
    try {
        var fileService = new FileService();

        await fileService.loadUrlToFile(config.full_list_url);
        fileService.loadFileChunk(VehicleService.prototype.callWorker);
        res.json({status: 'uploading'});
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


const resolvers = {
    Query: {
        make_all: async() => {return await mongoService.getAll()},
        make_id: async(_, {id}) => {return await mongoService.getMake({makeId: id})},
        make_name: async(_, {name}) => {return await mongoService.getMake({makeName: name})}
        }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready to accept GraphQL requests at ${url}.`);
});