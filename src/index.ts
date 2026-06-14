import express from "express";
import { middlewareLogResponse } from "./middleware/middlewareLogResponses.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerHits } from "./api/hits.js";
import { middlewareMetricsInc } from "./middleware/middlewareMetricsInc.js";
import { resetHits } from "./api/resetHits.js";
import { handlerChirpValidator } from "./api/chirpValidator.js";
import { errorHandler } from "./middleware/middlewareErrorHandler.js";
import { handlerCreateUser } from "./api/createUser.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
//client that runs migrations automatically upon server restarts
const migrationClient = postgres(config.dbConfig.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migrationConfig);

const app = express();
const PORT = config.apiConfig.port;

app.use(express.json()); //The middleware is smart. It typically only tries to parse the body if the request includes a Content-Type: application/json header. If a request comes in as plain text or an image, this specific middleware will usually ignore it and pass it to the next handler.
app.use(middlewareLogResponse);
// app.use(express.static(path.join(__dirname, "../.."))); //middleware to serve static files, __dirname is the code file (index.ts) and .. meaning one dir up to find the static file which is the root dir of project. This calculates the path relative to the script file. Since the script file and your assets usually stay in the same position relative to each other inside your project, the server will always find the files, regardless of which folder your terminal was sitting in when you hit "Enter."
app.use("/app", middlewareMetricsInc, express.static("./src/app")); //The "/app" is a mount path — it tells Express to only activate the static file middleware when the incoming request URL starts with /app.

app.get("/admin/metrics", async (req, res) => {
  await handlerHits(req, res);
});
app.get("/api/healthz", async (req, res) => {
  await handlerReadiness(req, res);
});

app.post("/admin/reset", async (req, res) => {
  await resetHits(req, res);
});
app.post("/api/validate_chirp", async (req, res) => {
  await handlerChirpValidator(req, res);
});
app.post("/api/users", async (req, res) => {
  await handlerCreateUser(req, res);
});

app.use(errorHandler); //put errorHandler at the end of all, just above listen

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
