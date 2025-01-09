// import des bibliothèques
import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
// import des modules
import { AppDataSource } from "./dataSource";
import { authRouter } from "./routes/authRoute";

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
		credentials: true,
	}),
);

// Connect to the database
AppDataSource.initialize()
	.then(() => console.log("Database connected"))
	.catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/auth", authRouter);

// Start the server
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
