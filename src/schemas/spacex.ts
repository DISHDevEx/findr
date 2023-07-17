import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    spacexCapsules: [Capsules!]!
  }

  type Capsules {
    reuse_count: Int
    water_landings: Int
    land_landings: Int
    last_update: String
    launches: [String]
    serial: String
    status: String
    type: String
    id: ID!
  }

`;
