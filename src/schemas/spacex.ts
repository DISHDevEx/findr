import gql from "graphql-tag";

export const typeDefs = gql`
  type Capsule {
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

  type Fairings {
    reused: Boolean!
    recovery_attempt: Boolean!
    recovered: Boolean!
    ships: [String!]!
  }
  
  type PatchLinks {
    small: String
    large: String
  }
  
  type RedditLinks {
    campaign: String
    launch: String
    media: String
    recovery: String
  }
  
  type FlickrLinks {
    small: [String!]!
    original: [String!]!
  }
  
  type Links {
    patch: PatchLinks
    reddit: RedditLinks
    flickr: FlickrLinks
    presskit: String
    webcast: String
    youtube_id: String
    article: String
    wikipedia: String
  }
  
  type Failure {
    time: Int!
    altitude: Float
    reason: String
  }
  
  type Core {
    core: String
    flight: Int
    gridfins: Boolean
    legs: Boolean
    reused: Boolean
    landing_attempt: Boolean
    landing_success: Boolean
    landing_type: String
    landpad: String
  }
  
  type Payload {
    id: String
  }
  
  type Launch {
    fairings: Fairings!
    links: Links!
    static_fire_date_utc: String
    static_fire_date_unix: Int
    net: Boolean!
    window: Int!
    rocket: String!
    success: Boolean!
    failures: [Failure!]!
    details: String
    crew: [String!]!
    ships: [String!]!
    capsules: [Capsule!]!
    payloads: [Payload!]!
    launchpad: String!
    flight_number: Int!
    name: String!
    date_utc: String!
    date_unix: Int!
    date_local: String!
    date_precision: String!
    upcoming: Boolean!
    cores: [Core!]!
    auto_update: Boolean!
    tbd: Boolean!
    launch_library_id: String
    id: String!
  }
  
  type Query {
    spacexCapsules: [Capsule]
    spacexLaunches: [Launch]
  }
`;
