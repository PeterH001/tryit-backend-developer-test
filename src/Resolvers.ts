import sqlite3 from "sqlite3";
import { similarity } from "./Similarity";
import { ApolloError } from "apollo-server-express";

const db = new sqlite3.Database("chinook.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  }else{
    console.log('Connected to the SQLite database.')
  }
});

const similarityTreshold = 0.9;

export const resolvers = {
  Query: {
    albums: (_, args: { title: string }) => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT 
              AlbumId
            , Title 
            FROM albums`,
          (
            err,
            rows: {
              AlbumId: number;
              Title: string;
            }[]
          ) => {
            if (err) {
              console.error("Error fetching albums:", err);
              reject(err);
            } else {
              const result = rows
                .filter((row) => {
                  if (similarity(row.Title, args.title) > similarityTreshold) {
                    return row;
                  }
                })
                .map((row) => ({
                  id: row.AlbumId!,
                  title: row.Title!,
                }));
              resolve(result);
            }
          }
        );
      });
    },
    album: (_, args: { id: number }) => {
      return new Promise((resolve, reject) => {
        db.get(
          `SELECT 
             AlbumId
            , Title 
            FROM albums 
            WHERE AlbumId = ?`,
          [args.id],
          (
            err,
            row: {
              AlbumId: number;
              Title: string;
            }
          ) => {
            if (err) {
              console.error("Error fetching album:", err);
              reject(err);
            } else if (!row) {
              const err = new ApolloError(
                `Album with ID ${args.id} not found.`,
                "ALBUM_NOT_FOUND",
                { id: args.id }
              );
              reject(err);
            } else {
              const result = {
                id: row.AlbumId!,
                title: row.Title!,
              };
              resolve(result);
            }
          }
        );
      });
    },
    artists: (_, args: { name: string }) => {
      return new Promise((resolve, reject) => {
        db.all(
          "SELECT ArtistId, Name FROM artists",
          (
            err,
            rows: {
              ArtistId: number;
              Name: string;
            }[]
          ) => {
            if (err) {
              console.error("Error fetching artists:", err);
              reject(err);
            } else {
              const result = rows
                .filter((row) => {
                  if (similarity(row.Name, args.name) > similarityTreshold) {
                    return row;
                  }
                })
                .map((row) => ({
                  id: row.ArtistId!,
                  name: row.Name!,
                }));
              resolve(result);
            }
          }
        );
      });
    },
    artist: (_, args: { id: number }) => {
      return new Promise((resolve, reject) => {
        db.get(
          "SELECT ArtistId, Name FROM artists WHERE ArtistId = ?",
          [args.id],
          (
            err,
            row: {
              ArtistId: number;
              Name: string;
            }
          ) => {
            if (err) {
              console.error("Error fetching artist:", err);
              reject(err);
            } else if (!row) {
              const err = new ApolloError(
                `Artist with ID ${args.id} not found.`,
                "ARTIST_NOT_FOUND",
                { id: args.id }
              );
              reject(err);
            } else {
              const result = {
                id: row.ArtistId!,
                name: row.Name!,
              };
              resolve(result);
            }
          }
        );
      });
    },
    track: (_, args: { id: number }) => {
      return new Promise((resolve, reject) => {
        db.get(
          `SELECT 
              TrackId
            , Name
            , Composer
            , Milliseconds
            , Bytes
            , UnitPrice 
            FROM tracks 
            WHERE TrackId = ?`,
          [args.id],
          (
            err,
            row:
              | {
                  TrackId: number;
                  Name: string;
                  Composer: string;
                  Milliseconds: number;
                  Bytes: number;
                  UnitPrice: number;
                }
              | undefined
          ) => {
            if (err) {
              console.error("Error fetching track:", err);
              reject(err);
            } else if (!row) {
              const err = new ApolloError(
                `Track with ID ${args.id} not found.`,
                "TRACK_NOT_FOUND",
                { id: args.id }
              );
              reject(err);
            } else {
              const result = {
                id: row.TrackId!,
                name: row.Name!,
                composer: row.Composer,
                milliseconds: row.Milliseconds,
                bytes: row.Bytes,
                price: row.UnitPrice,
              };
              resolve(result);
            }
          }
        );
      });
    },
  },
  // Resolvers for nested fields
  Album: {
    tracks: (album) => {
      return new Promise((resolve, reject) => {
        db.all(
          "SELECT TrackId, Name, Composer, Milliseconds, Bytes, UnitPrice FROM tracks WHERE AlbumId = ?",
          [album.id],
          (
            err,
            rows: {
              TrackId: number;
              Name: string;
              Composer: string;
              Milliseconds: number;
              Bytes: number;
              UnitPrice: number;
            }[]
          ) => {
            if (err) {
              console.error("Error fetching tracks:", err);
              reject(err);
            } else {
              const result = rows.map((row) => ({
                id: row.TrackId!,
                name: row.Name!,
                composer: row.Composer,
                milliseconds: row.Milliseconds,
                bytes: row.Bytes,
                price: row.UnitPrice,
              }));
              resolve(result);
            }
          }
        );
      });
    },
  },
  Artist: {
    albums: (artist) => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT AlbumId, Title 
          FROM albums 
          WHERE ArtistId = ?`,
          [artist.id],
          (
            err,
            rows: {
              AlbumId: number;
              Title: string;
            }[]
          ) => {
            if (err) {
              console.error("Error fetching albums:", err);
              reject(err);
            } else {
              const result = rows.map((row) => ({
                id: row.AlbumId!,
                title: row.Title!,
              }));
              resolve(result);
            }
          }
        );
      });
    },
  },
  Track: {
    album: (track) => {
      return new Promise((resolve, reject) => {
        db.get(
          `SELECT 
            a.AlbumId
          , a.Title 
        FROM albums as a 
        JOIN tracks AS t 
            ON a.AlbumId = t.AlbumId 
        WHERE t.TrackId = ?`,
          [track.id],
          (
            err,
            rows: {
              AlbumId: number;
              Title: string;
            }
          ) => {
            if (err) {
              console.error("Error fetching album:", err);
              reject(err);
            } else {
              const result = {
                id: rows.AlbumId!,
                title: rows.Title!,
              };
              resolve(result);
            }
          }
        );
      });
    },
    artist: (track) => {
      return new Promise((resolve, reject) => {
        db.get(
          `SELECT 
              ar.ArtistId
            , ar.Name 
          FROM artists AS ar 
          JOIN albums AS al 
            ON ar.ArtistId = al.ArtistId 
          JOIN tracks AS tr 
            ON al.AlbumId = tr.AlbumId 
          WHERE TrackId = ?`,
          [track.id],
          (
            err,
            rows: {
              ArtistId: number;
              Name: string;
            }
          ) => {
            if (err) {
              console.error("Error fetching artist:", err);
              reject(err);
            } else {
              const result = {
                id: rows.ArtistId!,
                name: rows.Name!,
              };
              resolve(result);
            }
          }
        );
      });
    },
  },
};

function closeDb() {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  closeDb();
});

process.on("SIGTERM", () => {
  closeDb();
});
