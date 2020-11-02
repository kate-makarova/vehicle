const { gql } = require('apollo-server');

const typeDefs = gql`    
    type VehicleType {
        typeId: Int!
        typeName: String!
    }
    
   type Make {
       makeId: Int!
       makeName: String!
       vehicleTypes: [VehicleType]
   }

    type Query {
        makes: [Make]
        make(id: Int!): Make
        types: [VehicleType]
        type(id: Int!): VehicleType
    }
`;

module.exports = typeDefs;