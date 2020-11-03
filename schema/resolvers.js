const MongoService = require('./../services/MongoService');
const mongoService = new MongoService();

const resolvers = {
    Query: {
        make_all: async() => {return await mongoService.getAll()},
        make_id: async(_, {id}) => {return await mongoService.getMake({makeId: id})},
        make_name: async(_, {name}) => {return await mongoService.getMake({makeName: name})}
    }
};

module.exports = resolvers;