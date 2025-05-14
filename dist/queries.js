import sqlite3 from "sqlite3";
const db = new sqlite3.Database("../chinook.db", sqlite3.OPEN_READONLY);
console.log("Connected to the database.");
let title = "Graffiti";
db.all("SELECT * FROM albums WHERE title LIKE ?", [`%${title}%`], (err, rows) => {
    if (err) {
        console.error("Error fetching albums:", err);
    }
    else {
        // rows.filter((row) => {
        //     //TODO: Implement filtering logic
        //     // For now, just return all rows
        //     return row;
        // });
        console.log(rows);
    }
});
