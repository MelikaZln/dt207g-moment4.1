require("dotenv").config(); // Ladda miljövariabler från .env-filen
const express = require("express");
const sqlite3 = require("sqlite3").verbose(); // Importera SQLite-databasen

// anslutning till databasen med den angivna sökvägen från miljövariabler
const db = new sqlite3.Database(process.env.DATABASE2);

// skapa användartabellen 
db.serialize(() => {
    // Radera tabellen om den redan existerar
    db.run("DROP TABLE IF EXISTS users");

    // Skapa en ny användartabell med kolumner för användarnamn, lösenord, e-post och skapad datum/tid
    db.run(`CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
})