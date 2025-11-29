// import des bibliothèques
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import path from "node:path";
// import des dataSources
import { dcartDataSource, mapDataSource } from "./dataSource/dataSource";
// import des routes
import { authRoutes } from "./routes/authRoutes";
import { dcartRoutes } from "./routes/builtMap/dcartRoutes";
import { mapRoutes } from "./routes/builtMap/mapRoutes";
import { mediaRoutes } from "./routes/common/mediaRoutes";
import { sessionRoutes } from "./routes/sessionRoutes";
import { storymapRoutes } from "./routes/storymap";
import { translationRoutes } from "./routes/translationRoutes";
// import des types
import "./utils/types/userTypes"; // pour étendre Request avec user

// on charge les variables d'environnement
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });

const app: Application = express();
const PORT = process.env.APP_PORT;
const HOST = process.env.APP_HOST;
const origin =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.APP_HOST}`
    : `http://${process.env.APP_HOST}:${process.env.FRONTEND_PORT}`;

// middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.set("trust proxy", 1);

// Connection aux bases de données : DCART et MAP
dcartDataSource
  .initialize()
  .then(() => console.log("La base de données DCART est connectée"))
  .catch((err) =>
    console.error("Erreur dans la connexion à la base de données DCART:", err)
  );
mapDataSource
  .initialize()
  .then(() => console.log("La base de données MAP est connectée"))
  .catch((err) =>
    console.error("Erreur dans la connexion à la base de données MAP:", err)
  );

const mediaPath = process.env.MEDIA_STORAGE_PATH
  ? path.resolve(process.env.MEDIA_STORAGE_PATH)
  : path.join(__dirname, "../media");

// Définition des préfixes des routes
app.use("/auth", authRoutes);
app.use("/session", sessionRoutes);
app.use("/dcart", dcartRoutes);
app.use("/map", mapRoutes);
app.use("/storymap", storymapRoutes);
app.use("/translation", translationRoutes);
app.use("/dcart/media", express.static(mediaPath));
app.use("/dcart/media", mediaRoutes);

// Démarrage du serveur
// app.listen(6001, "0.0.0.0", () =>
app.listen(PORT, () =>
  // console.log(`Server running on http://0.0.0.0:${PORT}`),
  console.log(`Server running on http://${HOST}:${PORT}`)
);
