// import des bibliothèques
import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
// import des modules
import { dcartDataSource, MapDataSource } from "./dataSource/dataSource";
import { dcartRoutes } from "./routes/dcartRoutes";
import { mapRoutes } from "./routes/mapRoutes";

// on charge les variables d'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.APP_PORT;

// Middleware
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

// Connect to the databases
dcartDataSource
	.initialize()
	.then(() => console.log("Database DCART connected"))
	.catch((err) => console.error("Database DCART connection error:", err));
MapDataSource.initialize()
	.then(() => console.log("Database MAP connected"))
	.catch((err) => console.error("Database MAP connection error:", err));

// Routes
app.use("/dcart", dcartRoutes);
app.use("/map", mapRoutes);

// Start the server
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
