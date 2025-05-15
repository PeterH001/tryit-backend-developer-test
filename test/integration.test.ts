import { it, expect } from "@jest/globals";
import { typeDefs } from "../src/TypeDefs";
import { resolvers } from "../src/Resolvers";
import { ApolloServer } from "apollo-server-express";
import { describe } from "node:test";

const testServer = new ApolloServer({ typeDefs, resolvers });

describe("Integration tests regarding albums", () => {
  it("should return an album with the provided id", async () => {
    const albumId = "1";
    const query = `query GetAlbumById($albumId: ID!) {
                  album(id: $albumId) {
                    id
                    title
                    tracks {
                      id
                      name
                    }
                  }
                }`;
    const response = await testServer.executeOperation({
      query,
      variables: { albumId: albumId },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.album).toBeDefined();
    expect(response.data?.album.id).toBe(albumId);
    expect(response.data?.album.title).toBeDefined();
    expect(response.data?.album.tracks).toBeDefined();
    expect(response.data?.album.tracks.length).toBeGreaterThan(0);
    expect(response.data?.album.tracks[0].id).toBeDefined();
    expect(response.data?.album.tracks[0].name).toBeDefined();
  });

  it("should throw an error when the album id null", async () => {
    const albumId = null;
    const query = `query GetAlbumById($albumId: ID!) {
                  album(id: $albumId) {
                    id
                    title
                    tracks {
                      id
                      name
                    }
                  }
                }`;
    const response = await testServer.executeOperation({
      query,
      variables: { albumId: albumId },
    });

    expect(response.errors).toBeDefined();
    expect(response.data).toBeUndefined();
  });

  it("should throw an error when the album id is out of bounds", async () => {
    const albumId = "100000";
    // Assuming this ID does not exist in the database
    const query = `query GetAlbumById($albumId: ID!) {
                  album(id: $albumId) {
                    id
                    title
                    tracks {
                      id
                      name
                    }
                  }
                }`;
    const response = await testServer.executeOperation({
      query,
      variables: { albumId: albumId },
    });

    expect(response.errors).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.album).toBeNull();
  });

  it("should throw an error when the album id is not a scalar", async () => {
    const albumId = "asdf";
    // Assuming this ID does not exist in the database
    const query = `query GetAlbumById($albumId: ID!) {
                  album(id: $albumId) {
                    id
                    title
                    tracks {
                      id
                      name
                    }
                  }
                }`;
    const response = await testServer.executeOperation({
      query,
      variables: { albumId: albumId },
    });

    expect(response.errors).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.album).toBeNull();
  });

  it("should return albums with the name similar to the provided title", async () => {
    const title = "BackBeat soundtrack";
    const query = `query GetAlbumsByTitle($title: String) {
                  albums(title: $title) {
                    id
                    title
                    tracks {
                      name
                      id
                    }
                  }
                }`;

    const response = await testServer.executeOperation({
      query,
      variables: { title: title },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.albums).toBeDefined();
    expect(response.data?.albums.length).toBeGreaterThan(0);
    expect(response.data?.albums[0].id).toBeDefined();
    expect(response.data?.albums[0].title).toBeDefined();
    expect(response.data?.albums[0].tracks).toBeDefined();
    expect(response.data?.albums[0].tracks.length).toBeGreaterThan(0);
    expect(response.data?.albums[0].tracks[0].id).toBeDefined();
    expect(response.data?.albums[0].tracks[0].name).toBeDefined();
  });

  it("should return an empty array when the given title does not match any albums", async () => {
    const title = "NonExistentAlbumTitle";
    const query = `query GetAlbumsByTitle($title: String) {
                  albums(title: $title) {
                    id
                    title
                    tracks {
                      name
                      id
                    }
                  }
                }`;

    const response = await testServer.executeOperation({
      query,
      variables: { title: title },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.albums).toBeDefined();
    expect(response.data?.albums.length).toBe(0);
  });

  it("should return an empty array when the given title is null", async () => {
    const title = null;
    const query = `query GetAlbumsByTitle($title: String) {
                  albums(title: $title) {
                    id
                    title
                    tracks {
                      name
                      id
                    }
                  }
                }`;

    const response = await testServer.executeOperation({
      query,
      variables: { title: title },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.albums).toBeDefined();
    expect(response.data?.albums.length).toBe(0);
  });
});

describe("Integration tests regarding artists", () => {
  it("should return an artist with the provided id", async () => {
    const artistId = "1";
    const query = `query GetArtistById($artistId: ID!) {
                    artist(id: $artistId) {
                        id
                        name
                        albums {
                        id
                        title
                        }
                    }
                    }`;
    const response = await testServer.executeOperation({
      query,
      variables: { artistId: artistId },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.artist).toBeDefined();
    expect(response.data?.artist.id).toBe(artistId);
    expect(response.data?.artist.name).toBeDefined();
    expect(response.data?.artist.albums).toBeDefined();
    expect(response.data?.artist.albums.length).toBeGreaterThan(0);
    expect(response.data?.artist.albums[0].id).toBeDefined();
    expect(response.data?.artist.albums[0].title).toBeDefined();
  });

  it("should throw an error when the artist id null", async () => {
    const artistId = null;
    const query = `query GetArtistById($artistId: ID!) {
                    artist(id: $artistId) {
                        id
                        name
                        albums {
                        id
                        title
                        }
                    }
                    }`;
    const response = await testServer.executeOperation({
      query,
      variables: { artistId: artistId },
    });

    expect(response.errors).toBeDefined();
    expect(response.data).toBeUndefined();
  });

  it("should throw an error when the artist id is out of bounds", async () => {
    const artistId = "100000";
    // Assuming this ID does not exist in the database
    const query = `query GetArtistById($artistId: ID!) {
                    artist(id: $artistId) {
                        id
                        name
                        albums {
                        id
                        title
                        }
                    }
                    }`;
    const response = await testServer.executeOperation({
      query,
      variables: { artistId: artistId },
    });
    expect(response.errors).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.artist).toBeNull();
  });

  it("should throw an error when the artist id is not a scalar", async () => {
    const artistId = "asdf";
    // Assuming this ID does not exist in the database
    const query = `query GetArtistById($artistId: ID!) {
                    artist(id: $artistId) {
                        id
                        name
                        albums {
                        id
                        title
                        }
                    }
                    }`;
    const response = await testServer.executeOperation({
      query,
      variables: { artistId: artistId },
    });
    expect(response.errors).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.artist).toBeNull();
  });

  it("should return artists with the name similar to the provided name", async () => {
    const name = "The Rolling Stones";
    const query = `query GetAlbumsByTitle($name: String) {
                  artists(name: $name) {
                    id
                    name
                    albums {
                      id
                      title
                    }
                  }
                }`;

    const response = await testServer.executeOperation({
      query,
      variables: { name: name },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.artists).toBeDefined();
    expect(response.data?.artists.length).toBeGreaterThan(0);
    expect(response.data?.artists[0].id).toBeDefined();
    expect(response.data?.artists[0].name).toBeDefined();
    expect(response.data?.artists[0].albums).toBeDefined();
    expect(response.data?.artists[0].albums.length).toBeGreaterThan(0);
    expect(response.data?.artists[0].albums[0].id).toBeDefined();
    expect(response.data?.artists[0].albums[0].title).toBeDefined();
  });

  it("should return an empty array when the given name does not match any artists", async () => {
    const name = "NonExistentArtistName";
    const query = `query GetAlbumsByTitle($name: String) {
                  artists(name: $name) {
                    id
                    name
                    albums {
                      id
                      title
                    }
                  }
                }`;

    const response = await testServer.executeOperation({
      query,
      variables: { name: name },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.artists).toBeDefined();
    expect(response.data?.artists.length).toBe(0);
  });

  it("should return an empty array when the given name is null", async () => {
    const name = null;
    const query = `query GetAlbumsByTitle($name: String) {
                  artists(name: $name) {
                    id
                    name
                    albums {
                      id
                      title
                    }
                  }
                }`;

    const response = await testServer.executeOperation({
      query,
      variables: { name: name },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.artists).toBeDefined();
    expect(response.data?.artists.length).toBe(0);
  });
});

describe("Integration tests regarding tracks", () => {
  it("should return a track with the provided id", async () => {
    const trackId = "1";
    const query = `query GetTrackById($trackId: ID!) {
                        track(id: $trackId) {
                          id
                          name
                          composer
                          milliseconds
                          bytes
                          price
                          album {
                            id
                            title
                          }
                          artist {
                            name
                            id
                          }
                        }
                    }`;

    const response = await testServer.executeOperation({
      query,
      variables: { trackId: trackId },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.track).toBeDefined();
    expect(response.data?.track.id).toBe(trackId);
    expect(response.data?.track.name).toBeDefined();
    expect(response.data?.track.composer).toBeDefined();
    expect(response.data?.track.milliseconds).toBeDefined();
    expect(response.data?.track.bytes).toBeDefined();
    expect(response.data?.track.price).toBeDefined();
    expect(response.data?.track.album).toBeDefined();
    expect(response.data?.track.album.id).toBeDefined();
    expect(response.data?.track.album.title).toBeDefined();
    expect(response.data?.track.artist).toBeDefined();
    expect(response.data?.track.artist.id).toBeDefined();
    expect(response.data?.track.artist.name).toBeDefined();
  });

  it("should throw an error when the track id null", async () => {
    const trackId = null;
    const query = `query GetTrackById($trackId: ID!) {
                        track(id: $trackId) {
                          id
                          name
                          composer
                          milliseconds
                          bytes
                          price
                          album {
                            id
                            title
                          }
                          artist {
                            name
                            id
                          }
                        }
                    }`;

    const response = await testServer.executeOperation({
      query,
      variables: { trackId: trackId },
    });
    expect(response.errors).toBeDefined();
    expect(response.data).toBeUndefined();
  });

  it("should throw an error when the track id is out of bounds", async () => {
    const trackId = "1000000";
    // Assuming this ID does not exist in the database
    const query = `query GetTrackById($trackId: ID!) {
                        track(id: $trackId) {
                          id
                          name
                          composer
                          milliseconds
                          bytes
                          price
                          album {
                            id
                            title
                          }
                          artist {
                            name
                            id
                          }
                        }
                    }`;

    const response = await testServer.executeOperation({
      query,
      variables: { trackId: trackId },
    });
    expect(response.errors).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.track).toBeNull();
  });

  it("should throw an error when the track id is not a scalar", async () => {
    const trackId = "abc";
    // Assuming this ID does not exist in the database
    const query = `query GetTrackById($trackId: ID!) {
                        track(id: $trackId) {
                          id
                          name
                          composer
                          milliseconds
                          bytes
                          price
                          album {
                            id
                            title
                          }
                          artist {
                            name
                            id
                          }
                        }
                    }`;

    const response = await testServer.executeOperation({
      query,
      variables: { trackId: trackId },
    });
    expect(response.errors).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.track).toBeNull();
  });
});
