const { gql } = require('apollo-server');

const typeDefs = gql`    
    type VehicleType {
        typeId: Int!
        typeName: String!
    }
    
   type Make {
       makeId: Int!
       makeName: String!
       types: [VehicleType]
   }

    type Query {
        make_all: [Make]
        make_id(id: Int!): Make
        make_name(name: String!): Make
    }
`;

module.exports = typeDefs;