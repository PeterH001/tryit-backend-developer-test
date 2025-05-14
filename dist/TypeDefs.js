import { gql } from "apollo-server-express";
export const typeDefs = gql `
#types
type Album{
    id: ID!
    title: String!
    tracks: [Track]
}

type Artist{
    id: ID!
    name: String!
    albums: [Album]
}

type Track{
    id: ID!
    name: String!
    composer: String
    milliseconds: Int
    bytes: Int
    price: Float
    album: Album
    artist: Artist   
}

#Queries
type Query {
    albums(title: String): [Album!]!    #Returns albums with at least a 90% match based on the title.
    album(id: ID!): Album               #Retrieves a specific album by its ID.
    artists(name: String): [Artist!]!   #Returns artists with at least a 90% match based on the name.
    artist(id: ID!): Artist             #Retrieves a specific artist by their ID.
    track(id: ID!): Track               #Retrieves a specific track by its ID.
}
`;
