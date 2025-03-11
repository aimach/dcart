// import des bibliothèques
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// on charge les variables d'environnement
dotenv.config();

export const dcartDataSource = new DataSource({
	type: "postgres",
	host: process.env.DCART_DB_HOST,
	port: Number.parseInt(process.env.DCART_DB_PORT as string, 10),
	username: process.env.DCART_DB_USERNAME,
	password: process.env.DCART_DB_PASSWORD,
	database: process.env.DCART_DB_NAME,
	synchronize: true, // Crée automatiquement les tables
	logging: false, // Active les logs pour le debug
	entities: [
		`${__dirname}/../entities/builtMap/*.ts`,
		`${__dirname}/../entities/storymap/*.ts`,
	],
});

export const mapDataSource = new DataSource({
	type: "postgres",
	host: process.env.MAP_DB_HOST,
	port: Number.parseInt(process.env.MAP_DB_PORT as string, 10),
	username: process.env.MAP_DB_USERNAME,
	password: process.env.MAP_DB_PASSWORD,
	database: process.env.MAP_DB_NAME,
	logging: true, // Active les logs pour le debug
});
