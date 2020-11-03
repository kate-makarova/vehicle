const fs = require('fs');
const request = require('request');
const config = require('./../config/config.json');

module.exports = class FileService {

    /**
     * Split the XML into parsable chunks and execute a callback function on each chunk.
     * The number of chunks os equal to the number of worker threads defined in config/config.json.
     *
     * @param processCallback
     */
    loadFileChunk(processCallback) {
        var nextPart = '';
        var formCorrectChunk = this.formCorrectChunk;

        var stats = fs.statSync(config.tmp_file);
        var fileSizeInBytes = stats["size"];
        var highWaterMark = Math.round(fileSizeInBytes / config.worker_number);

        var readStream = fs.createReadStream(config.tmp_file,{ highWaterMark: highWaterMark, encoding: 'utf8' });

        readStream.on('data', function(chunk) {
            var parts = formCorrectChunk(chunk, nextPart);
            nextPart = parts.nextPart;

            if(parts.part.length) {
                processCallback(parts.part);
            }

        })
    }

    /**
     * Form a parsable chunk of XML data (starting and ending with the right tags).
     *
     * @param chunk
     * @param nextPart
     * @returns {{nextPart: string, part: string}}
     */
    formCorrectChunk(chunk, nextPart) {
        const lastTagLength = '</AllVehicleMakes>'.length;

        var startIndex = chunk.lastIndexOf('<Results>');
        if(startIndex !== -1) {
            chunk = chunk.substr(startIndex + '<Results>'.length);
        }

        var splitIndex = chunk.lastIndexOf('</AllVehicleMakes>') + lastTagLength;
        var part = '<Result>'+nextPart + chunk.substr(0, splitIndex)+'</Result>';
        nextPart = chunk.substr(splitIndex);

        return {
            part: part,
            nextPart: nextPart
        };
    }

    /**
     * Download all the data into a temporary file.
     *
     * @param url
     * @returns {Promise<void>}
     */
    async loadUrlToFile(url) {
        // Here I do not expect multiple copies of the same process run in parallel,
        // so we only need one temporary file.
        fs.truncate(config.tmp_file, 0, () => {});
        request(url).pipe(fs.createWriteStream(config.tmp_file));
    }
}