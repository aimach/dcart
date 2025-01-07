// import des bibliothèques
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
// import des modules
import { AppDataSource } from "./dataSource";
// import des entités
import { User } from "./entities/User";

// on charge les variables d'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.APP_PORT;

// Middleware
app.use(express.json());
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
app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Backend in development!");
});

app.get("/users", async (req: Request, res: Response) => {
	const users = await AppDataSource.getRepository(User).find();
	console.log(users);
	res.json(users);
});

// Start the server
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
