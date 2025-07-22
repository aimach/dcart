// import des bibliothèques
import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
// import des dataSources
import { dcartDataSource, mapDataSource } from "./dataSource/dataSource";
// import des routes
import { dcartRoutes } from "./routes/builtMap/dcartRoutes";
import { mapRoutes } from "./routes/builtMap/mapRoutes";
import { authRoutes } from "./routes/authRoutes";
import { storymapRoutes } from "./routes/storymap";
import { sessionRoutes } from "./routes/sessionRoutes";
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
	}),
);
app.set("trust proxy", 1);

// Connection aux bases de données : DCART et MAP
dcartDataSource
	.initialize()
	.then(() => console.log("La base de données DCART est connectée"))
	.catch((err) =>
		console.error("Erreur dans la connexion à la base de données DCART:", err),
	);
mapDataSource
	.initialize()
	.then(() => console.log("La base de données MAP est connectée"))
	.catch((err) =>
		console.error("Erreur dans la connexion à la base de données MAP:", err),
	);

// Définition des préfixes des routes
app.use("/auth", authRoutes);
app.use("/session", sessionRoutes);
app.use("/dcart", dcartRoutes);
app.use("/map", mapRoutes);
app.use("/storymap", storymapRoutes);
app.use("/translation", translationRoutes);

// Démarrage du serveur
// app.listen(6001, "0.0.0.0", () =>
app.listen(PORT, () =>
	// console.log(`Server running on http://0.0.0.0:${PORT}`),
	console.log(`Server running on http://${HOST}:${PORT}`),
);
