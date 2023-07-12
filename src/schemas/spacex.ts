import gql from "graphql-tag";

export const spacexSchema = gql`
  type Missions {
    mission_name: String!,
    mission_id: ID!,
    manufacturers: [String],
    payload_ids: [String],
    wikipedia: String,
    website: String,
    description: String
  }

  type Payloads {
    payload_id: ID!,
    norad_id: [],
    reused: String,
    customers: [String],
    nationality: String,
    manufacturer: String,
    payload_type: String,
    payload_mass_kg: Int,
    payload_mass_lbs: Int,
    orbit: String,
    orbit_params: orbit_params

  }

  type orbit_params{
    reference_system: String,
    regime: String,
    longitude: Int,
    semi_major_axis_km: String,
    eccentricity: String,
    periapsis_km: Int,
    apoapsis_km: Int,
    inclination_deg: Int,
    period_min: Int,
    lifespan_years: Int
  }
`;
