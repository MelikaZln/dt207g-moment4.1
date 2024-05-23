# Moment 4 Del 1

I den här uppgiften ska vi ha en webbtjänst där användare ska kunna registrera (genom att ange username, password och email, två användare får inte ha samma username och email) och användaren ska kunna logga in. Till slut ska vi ha autentisering med hjälp av JWT och användaren ska autentiseras vid anropt till skyddat data i webbtjänsten. 

Här ska jag beskriva hur jag har löst uppgiften.

Till uppgfiten har jag server.js där jag har kod för att starta express-server och definiera dess routes.
I början av server.js har jag definierat moduler och variabler (express- och bodyParser modulerna, authRoutes som innehåller routes för autentisering och auktorisering, jsonwebtoken laddas för att hantera JWT, dotenv för att ladda in miljövariabler från .env-filen)
require("dotenv").config() används för at ladda in miljövariabler från .env-fil om det finns något.
process.env.PORT; använder den port som jag har skrivit i .env, i mitt fall är det 3130.
const app = express(); här skapas express-appen. 
app.use(bodyParser.json()); används för att ange att servern ska använda body-parser för att tolka JSON-förfrågningar. Detta gör det möjligt att enkelt hantera JSON-data som skickas till din server. 
app.use("/api", authRoutes); för att ange att alla routes definierade i authRoutes.js ska börja med /api detta innebär att alla routes definierade i autjRoutes.js kommer att tillgängliga under /api. 
app.get("/api/protected", authticateToken, (req, res) =>{...}) denna route kräver att användaren har en giltig JWT-token för att se till att anvädaren är autentiserad innan åtkomst till den skyddade resursen ges. Om användaren är autentiserad skickas ett JSON-svar tillbaka med meddelandet 'skyddar route'.
function authticateToken(req, res, next){...} här har jag en middleware-funktion för att validera token, alltså funktionen används som en middleware för att validera JWT-token som skickas med begäran till skyddade routes. 
Den första raden hämtar token från request headers om det finns, och sedan används jwt.verify()-metoden för att verifiera token mot den hemliga nyckeln som finns i miljövariabeln JWT_SECRET_KEY. Om token är ogiltig eller saknas skickas ett lämpligt felmeddelande tillbaka till klienten. Om token är giltig sätts username i request-objektet till användarnamnet som finns i JWT-tokenet, och funktionen next() anropas för att fortsätta till nästa middleware eller hanterare i kedjan.
app.listen(port, () => {...}) till slut har jag app.listen() för att starta express-servern och lyssna på angivna port. När servern har startats skrivs ett meddelande ut till terminalen för att indikera att servern kör och vilken port den lyssnar på.

I uppgiften har vi install.js, som förbereder databasen genom att skapa tabell för att lagra användarinformation.
I början laddas moduler och definieraas variabler (Express och sqlite3 modulerna för att hantera SQLite-databasen, dotenv för att ladda in miljövariabler från .env-filen)  
const db = new sqlite3.Database(process.env.DATABASE2); här skapas en anslutning till SQLite-basen genom att skapa en ny instans av Database-klassen från slqite3-modulen. Anslutningssträngen till databasen tas från miljövariabeln DATABASE2 som definieras i .env-filen. 
För att serialisera databasoperation och vara säker på att de körs i rätt ordning har jag använt db.serialize(), 
Sedan har jag skapat tabellen users genom db.run() men före det har jag tagit bort om en tabell med namnen users existreras, tabellen som har skapats har 5 kolumn (id, username, password, email, created). Till slut skrivs ett meddelande i console att tabellen har skapats framgångsrikt. 

Under mappen Routes har jag filen som heter authRoutes.js här har jag kod som definierar routes för autentisering i express-appen.
Precis som install.js och server.js har jag laddat in moduler och definierat variabler i början, 
const db = new sqlite3.Database(process.env.DATABASE2); här har jag skapat en snlutning till databasen, det tas från miljövariabeln DATABASE2 som definieras i .env-filen. Sedan har jag en route för att registrera en ny användare. 
router.post("/register", async(req, res) => {...}); den tar emot användarnamn, lösenord och email från request bodyn. Om något saknas returneras 400 status med felmeddelande. Sedan hashas lösenordet med bcrypt (för säkerhetens skull) och en förfrågan körs för att lägga till användaren i databasen. När användaren har skapats framgångsrikt så får man ett meddelande och status 201. I händelse av ett serverfel returneras en 500 Internal Server Error-status.
router.post("/login", async (req, res) => {...}); sedan finns det en POST-route /login som hanterar inloggning av användare. Den tar emot användarnamn och lösenord från request bodyn. Om något av dessa fält saknas returneras en 400 Bad Request-status med ett felmeddelande. Sedan kontrolleras om användaren finns i databasen. Om användaren inte finns returneras en 401 Unauthorized-status med ett meddelande om att användarnamn eller lösenord är inkorrekta(jag har inte separate felmeddelande för username och password för att öka säkerheten). Annars jämförs det angivna lösenordet med det hashade lösenordet i databasen med bcrypt. Om lösenorden matchar skapas en JWT-token med användarnamnet som payload och skickas till klienten tillsammans med ett meddelande om att användaren har loggats in.
module.exports= router; Till slut exporteras router så att den kan användas i andra delar av din applikation.
