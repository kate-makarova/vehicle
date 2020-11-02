const axios = require('axios');
const fs = require('fs');
const {Worker} = require('worker_threads');


module.exports = class LoadService {
    async loadURL(url) {
            const response = await axios.get(url);
            return response.data;
    }

    loadFileChunk(chunkSize) {
        const lastTagLength = '</AllVehicleMakes>'.length;
        var data = '';
        var nextPart = '';

        var readStream = fs.createReadStream('./tmp/tmp.xml',{ highWaterMark: 1000 * 1024, encoding: 'utf8' });

        readStream.on('data', function(chunk) {
            data += chunk;

            var startIndex = chunk.lastIndexOf('<Results>');
            if(startIndex !== -1) {
                chunk = chunk.substr(startIndex + '<Results>'.length);
            }

            var splitIndex = chunk.lastIndexOf('</AllVehicleMakes>') + lastTagLength;
            var part = '<Result>'+nextPart + chunk.substr(0, splitIndex)+'</Result>';
            nextPart = chunk.substr(splitIndex);

            if(part.length) {


                return new Promise((resolve, reject) => {
                    const worker = new Worker('./services/worker.js', {workerData: {part: part}});
                    worker.on('message', resolve);
                    worker.on('error', reject);
                    worker.on('exit', (code) => {
                        if (code !== 0)
                            reject(new Error(
                                `Stopped the Worker Thread with the exit code: ${code}`));
                    })
                })


                // const worker = new Worker('./services/VehicleService.js', {workerData: {
                //     part: part, parser: parser
                //     }});

            }

        }).on('end', function() {
           // console.log('###################');
        });
    }

    async loadUrlToFile(url) {
        // Here I do not expect multiple copies of the same process run in parallel,
        // so we only need one temporary file.
        request(url).pipe(fs.createWriteStream('./tmp/tmp.xml'));
    }
}