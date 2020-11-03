const { workerData, parentPort } = require('worker_threads')
const VehicleService = require('./services/VehicleService')

vehicleService = new VehicleService();
(async () => {
    try {
        var processed = await vehicleService.formMakeObjects(workerData.part);
        parentPort.postMessage({processed: processed})
    } catch (e) {
        console.log('Thread failed');
    }
})();


