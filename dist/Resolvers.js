import sqlite3 from "sqlite3";
const db = new sqlite3.Database("../chinook.db", sqlite3.OPEN_READONLY);
console.log("Connected to the database.");
export const resolvers = {
    Query: {
        // albums(title: String): [Album!]!    #Returns albums with at least a 90% match based on the title.
        // album(id: ID!): Album               #Retrieves a specific album by its ID.
        // artists(name: String): [Artist!]!   #Returns artists with at least a 90% match based on the name.
        // artist(id: ID!): Artist             #Retrieves a specific artist by their ID.
        // track(id: ID!): Track
        albums: async (_, title) => {
            return new Promise((resolve, reject) => {
                db.all("SELECT * FROM albums WHERE title LIKE ?", [`%${title}%`], (err, rows) => {
                    if (err) {
                        console.error("Error fetching albums:", err);
                        reject(err);
                    }
                    else {
                        // rows.filter((row) => {
                        //     //TODO: Implement filtering logic
                        //     // For now, just return all rows
                        //     return row;
                        // });
                        resolve(rows);
                    }
                });
            });
        },
    },
};
