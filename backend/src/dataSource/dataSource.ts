// import des bibliothèques
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "node:path";

// on charge les variables d'environnement
const envFile =
	process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

export const dcartDataSource = new DataSource({
	type: "postgres",
	host: process.env.DCART_DB_HOST,
	port: Number.parseInt(process.env.DCART_DB_PORT as string, 10),
	username: process.env.DCART_DB_USERNAME,
	password: process.env.DCART_DB_PASSWORD,
	database: process.env.DCART_DB_NAME,
	synchronize: true,
	logging: false, // Active les logs pour le debug
	migrations: ["src/migrations/*.ts"],
	entities: [
		`${__dirname}/../entities/builtMap/*.ts`,
		`${__dirname}/../entities/storymap/*.ts`,
		`${__dirname}/../entities/common/*.ts`,
		`${__dirname}/../entities/auth/*.ts`,
		`${__dirname}/../entities/session/*.ts`,
	],
	...(process.env.NODE_ENV === "production" && {
		ssl: {
			rejectUnauthorized: false,
		},
	}),
});

export const mapDataSource = new DataSource({
	type: "postgres",
	host: process.env.MAP_DB_HOST,
	port: Number.parseInt(process.env.MAP_DB_PORT as string, 10),
	username: process.env.MAP_DB_USERNAME,
	password: process.env.MAP_DB_PASSWORD,
	database: process.env.MAP_DB_NAME,
	logging: false, // Active les logs pour le debug
});
