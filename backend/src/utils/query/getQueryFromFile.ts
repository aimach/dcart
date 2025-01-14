import * as fs from "node:fs";
import * as path from "node:path";

// Fonction pour lire une requête SQL depuis un fichier
const getQueryFromFile = (filePath: string) => {
	return fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
};

export { getQueryFromFile };
