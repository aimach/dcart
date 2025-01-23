// import des entités
import { MapContent } from "../entities/MapContent";
// import des services
import { dcartDataSource, MapDataSource } from "../dataSource/dataSource";
import { getSourcesQuery } from "../utils/query/sourceQueryString";
import {
	getQueryStringForLocalisationFilter,
	getQueryStringForDateFilter,
	getQueryStringForIncludedElements,
	getQueryStringForExcludedElements,
} from "../utils/functions/functions";
import { handleError } from "../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const mapController = {
	getMapInformationsById: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			const { mapId } = req.params;
			if (mapId === "all") {
				const MapInfos = await dcartDataSource
					.getRepository(MapContent)
					.find({ where: { isActive: true } });
				res.status(200).send(MapInfos);
				return;
			}

			const mapInfos = await dcartDataSource
				.getRepository(MapContent)
				.findOneBy({ id: mapId });
			if (!mapInfos) {
				res.status(404).send({ Erreur: "Carte non trouvée" });
			} else {
				res.status(200).send(mapInfos);
			}
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupérer toutes les sources
	getSourcesByMapId: async (req: Request, res: Response): Promise<void> => {
		try {
			// on récupère params et query
			const { mapId } = req.params;

			// on prépare la variable à renvoyer
			let results = null;

			if (mapId === "exploration") {
				const { location, element, ante, post } = req.query;
				// on prépare les query des filtres
				const queryLocalisation = location
					? getQueryStringForLocalisationFilter(
							"greatRegion",
							Number.parseInt(location as string, 10),
						)
					: "";
				const queryAnte = ante
					? getQueryStringForDateFilter(
							"ante",
							Number.parseInt(ante as string, 10),
						)
					: "";
				const queryPost = post
					? getQueryStringForDateFilter(
							"post",
							Number.parseInt(post as string, 10),
						)
					: "";
				const queryIncludedElements = element
					? getQueryStringForIncludedElements(element as string)
					: "";

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQuery(
					queryLocalisation,
					"<=", // obligé d'intégrer les opérateurs ici, sinon ça plante
					"=",
					queryAnte,
					queryPost,
					queryIncludedElements,
					"",
				);
				results = await MapDataSource.query(sqlQuery, [3, 1]);
			} else {
				// on récupère les informations de la carte
				const mapInfos = await dcartDataSource
					.getRepository(MapContent)
					.findOneBy({ id: mapId });
				if (!mapInfos) {
					res.status(404).send({ Erreur: "Carte non trouvée" });
				}

				const {
					elementNb,
					elementOperator,
					divinityNb,
					divinityOperator,
					locationType,
					locationId,
					ante,
					post,
					includedElements,
					excludedElements,
				} = mapInfos as MapContent;

				// on prépare les query des filtres
				const queryLocalisation = getQueryStringForLocalisationFilter(
					locationType,
					locationId,
				);
				const queryAnte = ante ? getQueryStringForDateFilter("ante", ante) : "";
				const queryPost = post ? getQueryStringForDateFilter("post", post) : "";
				const queryIncludedElements = includedElements
					? getQueryStringForIncludedElements(includedElements)
					: "";
				const queryExcludedElements = excludedElements
					? getQueryStringForExcludedElements(excludedElements)
					: "";

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQuery(
					queryLocalisation,
					elementOperator, // obligé d'intégrer les opérateurs ici, sinon ça plante
					divinityOperator,
					queryAnte,
					queryPost as string,
					queryIncludedElements,
					queryExcludedElements,
				);

				// légende des paramètres : nombre d'éléments par attestation, id du théonyme/épithète, nombre de puissances divines
				results = await MapDataSource.query(sqlQuery, [elementNb, divinityNb]);
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	getAllGreatRegions: async (req: Request, res: Response): Promise<void> => {
		try {
			const results = await MapDataSource.query(
				"SELECT id, nom_fr, nom_en FROM grande_region",
			);

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	getAllDivinities: async (req: Request, res: Response): Promise<void> => {
		// récupérer la liste d'alaya
		try {
			const query = `SELECT
			element.id AS id,
			traduction.nom_fr AS nom_fr,
			traduction.nom_en AS nom_en
			FROM element
			LEFT JOIN
			(SELECT id_element, MIN(nom_fr) AS nom_fr, MIN(nom_en) AS nom_en FROM traduction_element GROUP BY id_element) 
			traduction ON element.id = traduction.id_element
			JOIN nature_element ON element.id_nature_element = nature_element.id
			WHERE nature_element.nom_fr LIKE $1
			ORDER BY element.id
			`;
			const results = await MapDataSource.query(query, ["%Substantif%"]);

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	getTimeMarkers: async (req: Request, res: Response): Promise<void> => {
		// récupérer dans la table datation le post_quem le plus bas et ante_quem le plus haut
		try {
			const query = `SELECT 
			MIN(post_quem) AS post_quem, 
			MAX(ante_quem) AS ante_quem 
			FROM datation`;
			const results = await MapDataSource.query(query);

			res.status(200).json(results[0]);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupérer toutes les sources avec un élément donné
	// getSourcesByElementId: async (req: Request, res: Response): Promise<void> => {
	// 	try {
	// 		// on récupère les paramètres
	// 		const { elementId } = req.params;
	// 		const {
	// 			elementNbByAttestation,
	// 			divinityPowerNb,
	// 			gods,
	// 			localisation,
	// 			languages,
	// 			ante,
	// 			post,
	// 		} = req.query;

	// 		// on prépare les query des filtres
	// 		const queryElements = gods
	// 			? getQueryStringForGodsFilter(gods as string)
	// 			: "";
	// 		const queryLocalisation = localisation
	// 			? getQueryStringForLocalisationFilter(localisation as string)
	// 			: "";
	// 		const queryLanguage = languages
	// 			? getQueryStringForLanguageFilter(languages as string)
	// 			: "";
	// 		const queryAnte = ante
	// 			? getQueryStringForDateFilter("ante", ante as string)
	// 			: "";
	// 		const queryPost = post
	// 			? getQueryStringForDateFilter("post", post as string)
	// 			: "";

	// 		// on récupère le texte de la requête SQL
	// 		const sqlQuery = getSourcesQuery(
	// 			"element",
	// 			queryElements,
	// 			queryLocalisation,
	// 			queryLanguage as string,
	// 			queryAnte as string,
	// 			queryPost as string,
	// 		);

	// 		// légende des paramètres : nombre d'éléments par attestation, id du théonyme/épithète, nombre de puissances divines
	// 		const results = await MapDataSource.query(sqlQuery, [
	// 			elementNbByAttestation ? elementNbByAttestation : 3,
	// 			`{${elementId}}`,
	// 			divinityPowerNb ? divinityPowerNb : 1,
	// 		]);

	// 		res.status(200).json(results);
	// 	} catch (error) {
	// 		handleError(res, error as Error);
	// 	}
	// },
};
