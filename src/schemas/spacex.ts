import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    spacexMissions: [Missions!]!
  }

  type Missions {
    mission_name: String!
    mission_id: ID!
    manufacturers: [String]
    payload: Payloads!
    wikipedia: String
    website: String
    description: String
  }

  type Payloads {
    payload_id: ID!
    norad_id: [String]
    reused: String
    customers: [String]
    nationality: String
    manufacturer: String
    payload_type: String
    payload_mass_kg: Int
    payload_mass_lbs: Int
    orbit: String
    orbit_params: [Orbit_Params!]!
  }

  type Orbit_Params {
    reference_system: String
    regime: String
    longitude: Int
    semi_major_axis_km: String
    eccentricity: String
    periapsis_km: Int
    apoapsis_km: Int
    inclination_deg: Int
    period_min: Int
    lifespan_years: Int
  }
`;
