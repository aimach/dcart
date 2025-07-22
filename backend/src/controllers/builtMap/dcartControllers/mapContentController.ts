// import des bibliothèques
import { In } from "typeorm";
import type jwt from "jsonwebtoken";
// import des entités
import { MapContent } from "../../../entities/builtMap/MapContent";
import { Tag } from "../../../entities/common/Tag";
import { User } from "../../../entities/auth/User";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
import { generateUniqueSlug } from "../../../utils/functions/builtMap";
import { jwtService } from "../../../utils/jwt";
// import des types
import type { Request, Response } from "express";

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
			const { isActive, searchText, myItems } = req.query;

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
					.leftJoinAndSelect(
						"attestations.customPointsArray",
						"customPointsArray",
					)
					.leftJoinAndSelect("filterMapContent.filter", "filter")
					.select([
						"map",
						"filterMapContent",
						"filter.type",
						"tags",
						"attestations",
						"icon",
						"color",
						"customPointsArray",
						"creator.username",
						"modifier.username",
					]);

				if (isActive) {
					const isActiveStatus = isActive === "true";
					query.where("map.isActive = :isActive", { isActive: isActiveStatus });
				}

				if (myItems) {
					const authHeader = req.headers.authorization;

					// récupération du token après "Bearer"
					const token = authHeader?.split(" ")[1];

					const decoded = jwtService.verifyToken(
						token as string,
					) as UserPayload;

					if (!decoded) {
						res.status(401).send({ error: "Token invalide ou expiré" });
						return;
					}

					// récupération de l'utilisateur
					const authenticatedUser = await dcartDataSource
						.getRepository("User")
						.findOne({
							where: { id: decoded.userId },
							select: { id: true, status: true },
						});

					if (!authenticatedUser) {
						res.status(401).json({ message: "Utilisateur non trouvé" });
						return;
					}

					query.andWhere(
						"(map.creator.id = :userId OR map.modifier.id = :userId)",
						{ userId: authenticatedUser.id },
					);
				}

				if (searchText) {
					query.andWhere(
						"(map.title_fr ILIKE :searchText OR map.title_en ILIKE :searchText OR map.description_fr ILIKE :searchText OR map.description_en ILIKE :searchText OR creator.username ILIKE :searchText OR modifier.username ILIKE :searchText)",
						{ searchText: `%${searchText}%` },
					);
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
				.leftJoinAndSelect(
					"attestations.customPointsArray",
					"customPointsArray",
				)
				.leftJoinAndSelect("filterMapContent.filter", "filter")
				.select([
					"map",
					"filterMapContent",
					"filter.type",
					"tags",
					"attestations",
					"icon",
					"color",
					"customPointsArray",
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

			const mapToSave = { ...req.body };

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
			delete mapToSave.filterMapContent;

			if (mapToUpdate.title_fr !== mapToSave.title_fr) {
				const newSlug = await generateUniqueSlug(
					mapToSave.title_fr,
					dcartDataSource.getRepository(MapContent),
				);
				mapToSave.slug = newSlug;
			}

			const updatedMap = await dcartDataSource
				.getRepository(MapContent)
				.merge(mapToUpdate, mapToSave);
			const newMap = await dcartDataSource
				.getRepository(MapContent)
				.save(updatedMap);

			const responseMap = {
				...newMap,
				filterMapContent: req.body.filterMapContent,
			};

			res.status(200).send(responseMap);
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
