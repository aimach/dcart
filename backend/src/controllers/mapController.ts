// import des entités
import { MapContent } from "../entities/MapContent";
// import des services
import { dcartDataSource, MapDataSource } from "../dataSource/dataSource";
import { getSourcesQuery } from "../utils/query/sourceQueryString";
import {
	getQueryStringForLocalisationFilter,
	getQueryStringForDateFilter,
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

			// on récupère les informations de la carte
			const mapInfos = await dcartDataSource
				.getRepository(MapContent)
				.findOneBy({ id: mapId });
			if (!mapInfos) {
				res.status(404).send({ Erreur: "Carte non trouvée" });
			}

			const {
				name,
				description,
				elementNb,
				elementOperator,
				divinityNb,
				divinityOperator,
				locationType,
				locationId,
				ante,
				post,
			} = mapInfos as MapContent;

			// on prépare les query des filtres
			const queryLocalisation = getQueryStringForLocalisationFilter(
				locationType,
				locationId,
			);
			const queryAnte = ante ? getQueryStringForDateFilter("ante", ante) : "";
			const queryPost = post ? getQueryStringForDateFilter("post", post) : "";

			// on récupère le texte de la requête SQL
			const sqlQuery = getSourcesQuery(
				queryLocalisation,
				elementOperator, // obligé d'intégrer les opérateurs ici, sinon ça plante
				divinityOperator,
				queryAnte as string,
				queryPost as string,
			);

			// légende des paramètres : nombre d'éléments par attestation, id du théonyme/épithète, nombre de puissances divines
			const results = await MapDataSource.query(sqlQuery, [
				elementNb,
				divinityNb,
			]);

			res.status(200).json(results);
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
