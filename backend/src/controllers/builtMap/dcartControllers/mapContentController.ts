// import des entités
import { MapContent } from "../../../entities/builtMap/MapContent";
import { Category } from "../../../entities/builtMap/Category";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import type jwt from "jsonwebtoken";
import { Storymap } from "../../../entities/storymap/Storymap";

export const mapContentController = {
	// récupérer les données de toutes les cartes ou d'une carte en particulier
	getMapContent: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			if (req.query.relatedMap) {
				const relatedMap = await dcartDataSource
					.getRepository(MapContent)
					.findOne({
						where: { relatedStorymap: mapId },
					});
				res.status(200).send(relatedMap?.id);
				return;
			}

			if (mapId === "all") {
				const query = await dcartDataSource
					.getRepository(MapContent)
					.createQueryBuilder("map")
					.leftJoinAndSelect("map.category", "category")
					.leftJoinAndSelect("map.creator", "creator")
					.leftJoinAndSelect("map.modifier", "modifier")
					.leftJoinAndSelect("map.filterMapContent", "filterMapContent")
					.leftJoinAndSelect("map.attestations", "attestations")
					.leftJoinAndSelect("attestations.icon", "icon")
					.leftJoinAndSelect("filterMapContent.filter", "filter")
					.select([
						"map",
						"filterMapContent",
						"filter.type",
						"category",
						"attestations",
						"attestations.icon",
						"creator.pseudo",
						"modifier.pseudo",
					]);

				if (req.query.isActive) {
					const isActive = req.query.isActive === "true";
					query.where("map.isActive = :isActive", { isActive });
				}
				const allMaps = await query.getMany();

				res.status(200).send(allMaps);
				return;
			}

			const mapInfos = await dcartDataSource
				.getRepository(MapContent)
				.createQueryBuilder("map")
				.leftJoinAndSelect("map.category", "category")
				.leftJoinAndSelect("map.filterMapContent", "filterMapContent")
				.leftJoinAndSelect("map.attestations", "attestations")
				.leftJoinAndSelect("attestations.icon", "icon")
				.leftJoinAndSelect("filterMapContent.filter", "filter")
				.select([
					"map",
					"filterMapContent",
					"filter.type",
					"category",
					"attestations",
					"icon",
				])
				.where("map.id = :mapId", { mapId })
				.getOne();

			if (!mapInfos) {
				res.status(404).send({ Erreur: "Carte non trouvée" });
			} else {
				res.status(200).send(mapInfos);
			}
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// créer une nouvelle carte
	createMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const {
				title_en,
				title_fr,
				description_en,
				description_fr,
				image_url,
				category,
				relatedStorymap,
			} = req.body;

			const { userId } = req.user as jwt.JwtPayload;

			// récupération de la date actuelle
			const currentDate = new Date();

			const newMap = dcartDataSource.getRepository(MapContent).create({
				title_en,
				title_fr,
				description_en,
				description_fr,
				image_url,
				relatedStorymap: relatedStorymap === "0" || relatedStorymap === "" ? null : relatedStorymap,
				category,
				creator: userId,
				uploadPointsLastDate: currentDate,
			});

			await dcartDataSource.getRepository(MapContent).save(newMap);

			res.status(201).send(newMap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// met à jour une carte
	updateMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;
			const { userId } = req.user as jwt.JwtPayload;

			const mapToUpdate = await dcartDataSource
				.getRepository(MapContent)
				.findOne({
					where: { id: mapId },
					relations: ["category", "filterMapContent"],
				});

			if (!mapToUpdate) {
				res.status(404).send("Carte non trouvée.");
				return;
			}

			// ajout de l'id du modificateur
			mapToUpdate.modifier = userId;

			// si c'est la mise à jour du statut de la carte
			if (req.query.isActive) {
				mapToUpdate.isActive = req.query.isActive === "true";
				const updatedMap = await dcartDataSource
					.getRepository(MapContent)
					.save(mapToUpdate);
				res.status(200).send(updatedMap);
				return;
			}

			// si la catégorie de la carte a été modifiée, ajout de la nouvelle catégorie au body
			const newCategory = await dcartDataSource
				.getRepository(Category)
				.findOne({
					where: { id: req.body.category.id },
				});
			req.body.category = newCategory;

			if (req.body.relatedStorymap === "0") {
				req.body.relatedStorymap = null;
			}

			// à corriger après la présentation
			delete req.body.filterMapContent;

			const updatedMap = await dcartDataSource.getRepository(MapContent).merge(mapToUpdate, req.body);
			const newMap = await dcartDataSource.getRepository(MapContent).save(updatedMap);

			res.status(200).send(newMap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// met à jour l'id de la storymap associée à la carte
	updateStorymapLink: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;
			const { storymapId } = req.body;

			if (mapId === "0") {
				const mapToUpdate = await dcartDataSource
					.getRepository(MapContent)
					.findOne({
						where: { relatedStorymap: storymapId },
					});

				if (!mapToUpdate) {
					res.status(404).send("Carte non trouvée.");
					return;
				}

				const updatedMap = await dcartDataSource
					.getRepository(MapContent)
					.create({
						...mapToUpdate,
						relatedStorymap: null,
					});

				const newMap = await dcartDataSource
					.getRepository(MapContent)
					.save(updatedMap);
				res.status(200).send(newMap);
				return;
			}

			const { userId } = req.user as jwt.JwtPayload;

			const mapToUpdate = await dcartDataSource
				.getRepository(MapContent)
				.findOne({
					where: { id: mapId },
				});

			if (!mapToUpdate) {
				res.status(404).send("Carte non trouvée.");
				return;
			}

			const storymapToAdd = await dcartDataSource
				.getRepository(Storymap)
				.findOne({
					where: { id: storymapId },
				});
			if (!storymapToAdd) {
				res.status(404).send("Storymap non trouvée.");
				return;
			}

			// ajout de l'id du modificateur
			mapToUpdate.modifier = userId;

			const updatedMap = await dcartDataSource
				.getRepository(MapContent)
				.create({
					...mapToUpdate,
					relatedStorymap: storymapId === "0" ? null : storymapId,
				});

			const newMap = await dcartDataSource
				.getRepository(MapContent)
				.save(updatedMap);

			res.status(200).send(newMap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// supprime une carte
	deleteMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			const mapToDelete = await dcartDataSource
				.getRepository(MapContent)
				.findOne({
					where: { id: mapId },
				});

			if (!mapToDelete) {
				res.status(404).send("Carte non trouvée.");
				return;
			}

			await dcartDataSource.getRepository(MapContent).delete(mapId);

			res.status(200).send("Carte supprimée.");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
