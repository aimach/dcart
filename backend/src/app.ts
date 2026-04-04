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
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.set("trust proxy", 1);

// Définition des préfixes des routes
app.use("/auth", authRoutes);
app.use("/session", sessionRoutes);
app.use("/dcart", dcartRoutes);
app.use("/map", mapRoutes);
app.use("/storymap", storymapRoutes);
app.use("/translation", translationRoutes);
app.use("/dcart/media", express.static(mediaPath));
app.use("/dcart/media", mediaRoutes);

async function start(): Promise<void> {
  try {
    await dcartDataSource.initialize();
    console.log("La base de données DCART est connectée");
    await mapDataSource.initialize();
    console.log("La base de données MAP est connectée");
  } catch (err) {
    console.error("Erreur d'initialisation des bases de données:", err);
    if (dcartDataSource.isInitialized) {
      await dcartDataSource.destroy().catch(() => {});
    }
    if (mapDataSource.isInitialized) {
      await mapDataSource.destroy().catch(() => {});
    }
    process.exit(1);
    return;
  }

  app.listen(PORT, () =>
    console.log(`Server running on http://${HOST}:${PORT}`),
  );
}

void start().catch((err) => {
  console.error("Erreur fatale au démarrage:", err);
  process.exit(1);
});
