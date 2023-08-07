import gql from "graphql-tag";

export const typeDefs = gql`
  
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

  type Height {
    meters: Float
    feet: Float
  }
  
  type Diameter {
    meters: Float
    feet: Float
  }
  
  type Thrust {
    kN: Float
    lbf: Float
  }
  
  type Mass {
    kg: Int
    lb: Int
  }
  
  type FirstStage {
    thrust_sea_level: Thrust
    thrust_vacuum: Thrust
    reusable: Boolean
    engines: Int
    fuel_amount_tons: Float
    burn_time_sec: Int
  }
  
  type CompositeFairing {
    height: Height
    diameter: Diameter
  }
  
  type Payloads {
    composite_fairing: CompositeFairing
    option_1: String
  }
  
  type Engines {
    isp: Isp
    thrust_sea_level: Thrust
    thrust_vacuum: Thrust
    number: Int
    type: String
    version: String
    layout: String
    engine_loss_max: Int
    propellant_1: String
    propellant_2: String
    thrust_to_weight: Int
  }
  
  type Isp {
    sea_level: Int
    vacuum: Int
  }
  
  type LandingLegs {
    number: Int
    material: String
  }
  
  type PayloadWeight {
    id: String
    name: String
    kg: Int
    lb: Int
  }
  
  type SecondStage {
    thrust: Thrust
    payloads: Payloads
    reusable: Boolean
    engines: Int
    fuel_amount_tons: Float
    burn_time_sec: Int
  }

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

  type Rocket {
    height: Height
    diameter: Diameter
    mass: Mass
    first_stage: FirstStage
    second_stage: SecondStage
    engines: Engines
    landing_legs: LandingLegs
    payload_weights: [PayloadWeight]
    flickr_images: [String]
    name: String
    type: String
    active: Boolean
    stages: Int
    boosters: Int
    cost_per_launch: Int
    success_rate_pct: Int
    first_flight: String
    country: String
    company: String
    wikipedia: String
    description: String
    id: ID
  }

  type Launch {
    fairings: Fairings!
    links: Links!
    static_fire_date_utc: String
    static_fire_date_unix: Int
    net: Boolean!
    window: Int!
    rocket: [Rocket!]!
    success: Boolean
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
    spacexRockets: [Rocket]
  }
  
`;
