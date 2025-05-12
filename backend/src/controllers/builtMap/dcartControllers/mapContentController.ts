// import des bibliothèques
import { In } from "typeorm";
// import des entités
import { MapContent } from "../../../entities/builtMap/MapContent";
import { Tag } from "../../../entities/common/Tag";
import { User } from "../../../entities/auth/User";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
import { generateUniqueSlug } from "../../../utils/functions/builtMap";
// import des types
import type { Request, Response } from "express";
import type jwt from "jsonwebtoken";

interface UserPayload extends jwt.JwtPayload {
	userStatus: "admin" | "writer";
	userId: string;
}

// extension de l'interface Request pour inclure la propriété user
declare global {
	namespace Express {
		interface Request {
			user?: UserPayload;
		}
	}
}

export const mapContentController = {
	// récupérer les données de toutes les cartes ou d'une carte en particulier par son id ou son slug
	getMapContent: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId, mapSlug } = req.params;
			const identifier = mapId ?? mapSlug;

			if (identifier === "all") {
				const query = await dcartDataSource
					.getRepository(MapContent)
					.createQueryBuilder("map")
					.leftJoinAndSelect("map.tags", "tags")
					.leftJoinAndSelect("map.creator", "creator")
					.leftJoinAndSelect("map.modifier", "modifier")
					.leftJoinAndSelect("map.filterMapContent", "filterMapContent")
					.leftJoinAndSelect("map.attestations", "attestations")
					.leftJoinAndSelect("attestations.icon", "icon")
					.leftJoinAndSelect("attestations.color", "color")
					.leftJoinAndSelect("filterMapContent.filter", "filter")
					.select([
						"map",
						"filterMapContent",
						"filter.type",
						"tags",
						"attestations",
						"attestations.icon",
						"attestations.color",
						"creator.pseudo",
						"modifier.pseudo",
					]);

				if (req.query.isActive) {
					const isActive = req.query.isActive === "true";
					query.where("map.isActive = :isActive", { isActive });
				}
				const allMaps = await query.orderBy("map.id").getMany();

				res.status(200).send(allMaps);
				return;
			}

			const whereQuery = mapId
				? "map.id = :identifier"
				: "map.slug = :identifier";
			const whereParams = mapId
				? { identifier: mapId }
				: { identifier: mapSlug };

			const mapInfos = await dcartDataSource
				.getRepository(MapContent)
				.createQueryBuilder("map")
				.leftJoinAndSelect("map.tags", "tags")
				.leftJoinAndSelect("map.filterMapContent", "filterMapContent")
				.leftJoinAndSelect("map.attestations", "attestations")
				.leftJoinAndSelect("attestations.icon", "icon")
				.leftJoinAndSelect("attestations.color", "color")
				.leftJoinAndSelect("filterMapContent.filter", "filter")
				.select([
					"map",
					"filterMapContent",
					"filter.type",
					"tags",
					"attestations",
					"icon",
					"color",
				])
				.where(whereQuery, whereParams)
				.getOne();

			if (!mapInfos) {
				res.status(404).send({ Erreur: "Carte non trouvée" });
				return;
			}
			res.status(200).send(mapInfos);
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
				tags,
			} = req.body;

			const { userId } = req.user as UserPayload;

			// récupération de la date actuelle
			const currentDate = new Date();

			// récupération du créateur de la carte
			const creator = await dcartDataSource
				.getRepository(User)
				.findOne({ where: { id: userId } });

			if (!creator) {
				res.status(404).send("Utilisateur non trouvé.");
				return;
			}

			// récupération des tags
			const tagIds = tags.split("|");
			const tagsToSave = await dcartDataSource
				.getRepository(Tag)
				.find({ where: { id: In(tagIds) } });
			if (tagsToSave.length !== tagIds.length) {
				res.status(404).send("Tags non trouvés.");
				return;
			}

			const slug = await generateUniqueSlug(
				title_fr,
				dcartDataSource.getRepository(MapContent),
			);

			const newMap = dcartDataSource.getRepository(MapContent).create({
				title_en,
				title_fr,
				description_en,
				description_fr,
				image_url,
				slug,
				creator,
				tags: tagsToSave,
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
			const { tags } = req.body;

			const mapToUpdate = await dcartDataSource
				.getRepository(MapContent)
				.findOne({
					where: { id: mapId },
					relations: ["tags", "filterMapContent"],
				});

			if (!mapToUpdate) {
				res.status(404).send("Carte non trouvée.");
				return;
			}

			// ajout de l'id du modificateur
			mapToUpdate.modifier = userId;

			// si c'est la mise à jour du statut de la carte
			if (req.query.isActive) {
				// on vérifie si l'utilisateur est admin
				if (req.user?.userStatus !== "admin") {
					res.status(403).send("Accès refusé");
					return;
				}
				mapToUpdate.isActive = req.query.isActive === "true";
				const updatedMap = await dcartDataSource
					.getRepository(MapContent)
					.save(mapToUpdate);
				res.status(200).send(updatedMap);
				return;
			}

			// récupération des tags
			let tagIds: string[] = [];
			if (Array.isArray(tags)) {
				tagIds = tags.map((tag) => tag.id);
			} else {
				tagIds = tags.split("|");
			}
			const tagsToSave = await dcartDataSource
				.getRepository(Tag)
				.find({ where: { id: In(tagIds) } });
			if (tagsToSave.length !== tagIds.length) {
				res.status(404).send("Tags non trouvés.");
				return;
			}

			mapToUpdate.tags = tagsToSave;

			// biome-ignore lint/performance/noDelete:
			delete req.body.filterMapContent;

			if (mapToUpdate.title_fr !== req.body.title_fr) {
				const newSlug = await generateUniqueSlug(
					req.body.title_fr,
					dcartDataSource.getRepository(MapContent),
				);
				req.body.slug = newSlug;
			}

			const updatedMap = await dcartDataSource
				.getRepository(MapContent)
				.merge(mapToUpdate, req.body);
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
