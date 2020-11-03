const path = require("path");
const FileService = require('./../services/FileService');
const VehicleService = require('./../services/VehicleService');
const config = require('./../config/config.json');
const MongoService = require('./../services/MongoService');

module.exports = class AppController {

    index(req, res) {
        res.sendFile('index.html', { root: path.join(__dirname, '../views') });
    }

    async upload(req, res) {
        try {
            var fileService = new FileService();

            await fileService.loadUrlToFile(config.full_list_url);
            fileService.loadFileChunk(VehicleService.prototype.callWorker);
            res.send('Uploading. The process may take approximately 5 minutes. Follow the progress in console.');
        } catch(e) {
            res.json({error: e.message});
        }
    }

    async all(req, res) {
        try {
            var mongoService = new MongoService();
            res.json(await mongoService.getAll());
        } catch(e) {
            res.json({error: e.message});
        }
    }


}