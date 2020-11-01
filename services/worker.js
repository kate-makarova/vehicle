const { workerData, parentPort } = require('worker_threads')
const xml2js = require('xml2js');
const LoadService = require('./LoadService');

var parser = xml2js.Parser();
var loader = new LoadService();

parser.parseString(workerData.part, async (err, data) => {
    if(data) {

        // For cycles instead of foreach are chosen because they are said to be significantly faster.
        for (var i = 0; i < data.Result.AllVehicleMakes.length; i++) {
            var url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${data.Result.AllVehicleMakes[i].Make_ID}?format=xml`;
            var typesXml = await loader.loadURL(url)
            var types = await new Promise((resolve, reject) => parser.parseString(typesXml, (err, data) => {
                if (err) reject(err);
                resolve(data);
            }));

            var make = {
                makeId: data.Result.AllVehicleMakes[i].Make_ID,
                makeName: data.Result.AllVehicleMakes[i].Make_Name,
                types: []
            }
            for(var j = 0; j < types.Response.Results[0].VehicleTypesForMakeIds.length; j++) {
                make.types.push({
                    typeId: types.Response.Results[0].VehicleTypesForMakeIds[j].VehicleTypeId[0],
                    typeName: types.Response.Results[0].VehicleTypesForMakeIds[j].VehicleTypeName[0],
                })
            }

            console.log(make)
        }
    }
    else {
        console.log('Error');
    }
    parentPort.postMessage(
        {status: 'Done' })
})