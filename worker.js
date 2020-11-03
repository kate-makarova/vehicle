const { workerData, parentPort } = require('worker_threads')
const VehicleService = require('./services/VehicleService')

console.log('called');
vehicleService = new VehicleService();
(async () => {
    try {
        console.log('inside');
        var processed = await vehicleService.formMakeObjects(workerData.part);
        parentPort.postMessage({processed: processed})
    } catch (e) {
        console.log('Thread failed');
    }
})();


