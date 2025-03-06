// import des bibliothèques
import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
// import des dataSources
import { dcartDataSource, mapDataSource } from "./dataSource/dataSource";
// import des routes
import { dcartRoutes } from "./routes/dcartRoutes";
import { mapRoutes } from "./routes/mapRoutes";
import { authRoutes } from "./routes/authRoutes";

// on charge les variables d'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.APP_PORT;

// middleware
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(
	cors({
		origin: [`http://localhost:${process.env.FRONTEND_PORT}`],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);

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
app.use("/dcart", dcartRoutes);
app.use("/map", mapRoutes);
app.use("/auth", authRoutes);

// Démarrage du serveur
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
