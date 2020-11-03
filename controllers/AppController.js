const path = require("path");
const FileService = require('./../services/FileService');
const VehicleService = require('./../services/VehicleService');
const config = require('./../config/config.json');
const MongoService = require('./../services/MongoService');
const schedule = require('node-schedule');

module.exports = class AppController {

    index(req, res) {
        res.sendFile('index.html', { root: path.join(__dirname, '../views') });
    }

    /**
     * Download the data.
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async download(req, res) {
        try {
            var fileService = new FileService();

            await fileService.loadUrlToFile(config.full_list_url);
            fileService.loadFileChunk(VehicleService.prototype.callWorker);

            // This callback is also called from the scheduler, when there is no request or response objects.
            if(res) {
                res.send('Uploading. The process may take approximately 10 minutes. Follow the progress in console.');
            }
        } catch(e) {
            if(res) {
                res.json({error: e.message});
            } else {
                console.log(e.message);
            }
        }
    }

    /**
     * Show all data.
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async all(req, res) {
        try {
            var mongoService = new MongoService();
            res.json(await mongoService.getAll());
        } catch(e) {
            res.json({error: e.message});
        }
    }

    /**
     * Schedule regular data update.
     *
     * @param req
     * @param res
     */
    schedule(req, res) {
        var timeUnit = req.params.timeUnit;
        if(timeUnit !== 'day' && timeUnit !== 'hour' && timeUnit !== 'minute')
            throw new Error('Wrong time unit. The allowed time units are: "day", "hour", "minute"');

        var number = parseInt(req.params.number);
        if(isNaN(number))
            throw new Error('Wrong time value. Time value should be numeric.');
        if(number <= 0)
            throw new Error('Wrong time value. Time value should be a positive number.');

        var cronTime = '';
        switch(timeUnit) {
            case 'minute':
                cronTime = `${number} * * * * *`;
                break;
            case 'hour':
                cronTime = `0 ${number} * * * *`;
                break;
            case 'day':
                cronTime = `0 0 ${number} * * *`;
                break;
            default:
                throw new Error('Wrong time unit.');
        }

        schedule.scheduleJob(cronTime, () => {
            AppController.prototype.download(null, null)
        });
        res.send(`<p>The updating task has been scheduled to be performed every ${number} ${timeUnit}(s).</p>`+
        '<p>To discontinue the task stop the service.</p>');
    }


}