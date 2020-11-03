const config = require('./../config/config.json');
const xml2js = require('xml2js');
const MongoService = require('./MongoService');
const {Worker} = require('worker_threads');
const axios = require('axios');

/**
 * This service helps to form and process vehicle-related data structures.
 *
 * @type {VehicleService}
 */
module.exports = class VehicleService {

    constructor() {
        this.parser = xml2js.Parser();
        this.mongoService = new MongoService();
    }

    /**
     * Initiate a separate thread to process a chunk of data.
     *
     * @param part
     * @returns {Promise<unknown>}
     */
    callWorker(part) {

        // There are more elegant ways to store data, for example, storing it in file, or database,
        // or a SharedBuffer, but for the only purpose of logging the results on the console,
        // this should be enough.
        if(!global.activeWorkers)
            global.activeWorkers = 0;
        if(!global.total)
            global.total = 0;

        const worker = new Worker('./worker.js', {workerData: {part: part}});
        global.activeWorkers += 1;

        worker.on('message', (result) => {
            console.log(`${result.processed} documents have been updated`);
            global.activeWorkers -= 1;
            global.total += result.processed;

            if(!global.activeWorkers) {
                console.log(`All workers are finished. Total number of documents updated: ${global.total}`)
            }
        });

        worker.on('error', (err) => {
            console.log(err);
        });

        worker.on('exit', (code) => {
            if (code !== 0)
                console.log(`Stopped the Worker Thread with the exit code: ${code}`);
        })
    }

    /**
     * Form basic objects from the main XML source.
     *
     * @param part
     * @returns {Promise<void>}
     */
    async formMakeObjects(part) {
        return new Promise((resolve, reject) => this.parser.parseString(part, async (err, data) => {
            if (data) {
                // For cycles instead of foreach are chosen because they are said to be significantly faster.
                for (var i = 0; i < data.Result.AllVehicleMakes.length; i++) {
                    var make = {
                        makeId: parseInt(data.Result.AllVehicleMakes[i].Make_ID[0]),
                        makeName: data.Result.AllVehicleMakes[i].Make_Name[0],
                    }

                    make.types = await this.addTypeData(data.Result.AllVehicleMakes[i].Make_ID[0]);
                    this.mongoService.addOrUpdate(make);
                }
            } else {
                console.log('Error');
            }
            resolve(data.Result.AllVehicleMakes.length);
        }))
    }

    /**
     * Add type data to a make object.
     *
     * @param makeId
     * @returns {Promise<{makeId: *, types: [], makeName: *}>}
     */
    async addTypeData(makeId) {
        var url = config.type_list_url + `/${makeId}?format=xml`;
        var typesXml = await this.loadURL(url);
        var typesData = await new Promise((resolve, reject) => this.parser.parseString(typesXml, (err, data) => {
            if (err) reject(err);
            resolve(data);
        }));

        var types = [];

        if(typesData.Response.Results.length) {
            for (var j = 0; j < typesData.Response.Results[0].VehicleTypesForMakeIds.length; j++) {
                types.push({
                    typeId: parseInt(typesData.Response.Results[0].VehicleTypesForMakeIds[j].VehicleTypeId[0]),
                    typeName: typesData.Response.Results[0].VehicleTypesForMakeIds[j].VehicleTypeName[0],
                })
            }
        }
        return types;
    }

    async loadURL(url) {
        const response = await axios.get(url);
        return response.data;
    }
}