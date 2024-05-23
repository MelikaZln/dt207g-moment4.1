// Importera nödvändiga moduler
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

// Skapa en Express-app
const app = express();
const db = new sqlite3.Database(process.env.DATABASE2);
// Ange port
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Autentisera användare
function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ message: "Token saknas!" });
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Inte korrekt JWT!" });
        req.user = user;
        next();
    });
}

// Autentiseringsroutes
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);


// Skydda en API-rutt
app.get("/api/protected", authenticateUser, (req, res) => {
    res.json({ message: "Skyddad route" });
});



// Starta servern
app.listen(port, () => {
    console.log(`Servern är igång på http://localhost:${port}`);
});
