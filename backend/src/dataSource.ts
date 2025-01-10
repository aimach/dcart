// import des bibliothèques
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// on charge les variables d'environnement
dotenv.config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "db",
	port: Number.parseInt(process.env.DB_PORT as string, 10),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true, // Crée automatiquement les tables
	logging: false, // Active les logs pour le debug
	entities: [`${__dirname}/entities/*.ts`],
});
