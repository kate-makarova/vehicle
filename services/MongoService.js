const mongo = require('mongodb');
const config = require('./../config/config.json')

module.exports = class MongoService {

    constructor() {
        const MongoClient = mongo.MongoClient
        this.client = new MongoClient(config.database_url, {useUnifiedTopology: true})
        this.connection = this.client.connect()
    }

    /**
     * Updates an existing record or creates a new one.
     *
     * @param make
     */
    addOrUpdate(make) {
        this.connection.then(() => {
            const db = this.client.db(config.database_name)
            const coll = db.collection('vehicles')
            coll.updateOne({makeId: make.makeId}, {$set: make}, {upsert: true})
        })
    }

    async getAll() {
        return new Promise((resolve, reject) => {
                this.connection.then(() => {
                    const db = this.client.db(config.database_name)
                    const coll = db.collection('vehicles')

                    coll.find({}).sort({makeId: 1}).toArray(function (err, result) {
                        if (err) {
                            reject(err.message);
                        } else {
                            resolve(result);
                        }
                    })
                })
            }
        )
    }

    async getMake(criteria) {
        return new Promise((resolve, reject) => {
            this.connection.then(async () => {
                const db = this.client.db(config.database_name);
                const coll = db.collection('vehicles');

                var result = await coll.findOne(criteria);
                resolve(result);
            })
        })
    }

}