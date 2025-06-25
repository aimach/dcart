// import des bibliothèques
import { In } from "typeorm";
// import des entités
import { Tag } from "../../entities/common/Tag";
// import des types
import type jwt from "jsonwebtoken";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { Storymap } from "../../entities/storymap/Storymap";
import { handleError } from "../../utils/errorHandler/errorHandler";
import { generateUniqueSlug } from "../../utils/functions/builtMap";
import { jwtService } from "../../utils/jwt";
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

export const storymapContentControllers = {
	// récupère une storymap par son id ou son slug
	getStorymapInfos: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id, slug } = req.params;
			const identifier = id ?? slug;
			const { isActive, searchText, myItems } = req.query;

			if (identifier === "all") {
				const query = await dcartDataSource
					.getRepository(Storymap)
					.createQueryBuilder("storymap")
					.leftJoinAndSelect("storymap.tags", "tags")
					.leftJoinAndSelect("storymap.blocks", "block")
					.leftJoinAndSelect("block.attestations", "attestations")
					.leftJoinAndSelect("attestations.icon", "icon")
					.leftJoinAndSelect("attestations.color", "color")
					.leftJoinAndSelect("block.type", "type")
					.leftJoinAndSelect("block.children", "child")
					.leftJoinAndSelect("child.type", "child_type")
					.leftJoinAndSelect("child.attestations", "step_attestations")
					.leftJoinAndSelect("storymap.creator", "creator")
					.leftJoinAndSelect("storymap.modifier", "modifier")
					.select([
						"storymap",
						"tags",
						"block",
						"attestations",
						"icon",
						"color",
						"type",
						"child",
						"child_type",
						"step_attestations",
						"creator.username",
						"modifier.username",
					]);
				if (isActive) {
					const isActiveStatus = isActive === "true";
					query.where("storymap.isActive = :isActive", {
						isActive: isActiveStatus,
					});
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
						"(storymap.creator.id = :userId OR storymap.modifier.id = :userId)",
						{ userId: authenticatedUser.id },
					);
				}

				if (searchText) {
					query.andWhere(
						"(storymap.title_lang1 ILIKE :searchText OR storymap.title_lang2 ILIKE :searchText OR storymap.description_lang1 ILIKE :searchText OR storymap.description_lang2 ILIKE :searchText OR creator.username ILIKE :searchText OR modifier.username ILIKE :searchText)",
						{ searchText: `%${searchText}%` },
					);
				}

				const allStorymaps = await query
					.orderBy("storymap.id")
					.addOrderBy("block.position", "ASC")
					.getMany();

				res.status(200).send(allStorymaps);
				return;
			}
			const whereQuery = id
				? "storymap.id = :identifier"
				: "storymap.slug = :identifier";
			const whereParams = id ? { identifier: id } : { identifier: slug };

			const storymapInfos = await dcartDataSource
				.getRepository(Storymap)
				.createQueryBuilder("storymap")
				.leftJoinAndSelect("storymap.tags", "tags")
				.leftJoinAndSelect("storymap.blocks", "block")
				.leftJoinAndSelect("block.attestations", "attestations")
				.leftJoinAndSelect("attestations.icon", "icon")
				.leftJoinAndSelect("attestations.color", "color")
				.leftJoinAndSelect("block.type", "type")
				.leftJoinAndSelect("block.children", "child")
				.leftJoinAndSelect("child.type", "child_type")
				.leftJoinAndSelect("child.attestations", "step_attestations")
				.leftJoinAndSelect("storymap.creator", "creator")
				.leftJoinAndSelect("storymap.modifier", "modifier")
				.leftJoinAndSelect("storymap.lang1", "lang1")
				.leftJoinAndSelect("storymap.lang2", "lang2")
				.select([
					"storymap",
					"tags",
					"block",
					"attestations",
					"icon",
					"color",
					"type",
					"child",
					"child_type",
					"step_attestations",
					"creator.pseudo",
					"modifier.pseudo",
					"lang1",
					"lang2",
				])
				.where(whereQuery, whereParams)
				.orderBy("block.position", "ASC")
				.getOne();

			if (!storymapInfos) {
				res.status(404).send({ message: "Storymap not found" });
				return;
			}

			if (storymapInfos?.blocks?.length) {
				// on filtre les blocks pour enlever ceux qui n'ont pas de position ou qui sont de type "step"
				storymapInfos.blocks = storymapInfos.blocks.filter(
					(block) => block.position !== null && block.type?.name !== "step",
				);
			}

			res.status(200).send(storymapInfos);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// crée une nouvelle storymap
	createNewStorymap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.user as UserPayload;
			const { tags } = req.body;

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
				req.body.title_lang1,
				dcartDataSource.getRepository(Storymap),
			);

			const newStorymap = dcartDataSource.getRepository(Storymap).create({
				...req.body,
				slug,
				tags: tagsToSave,
				creator: userId,
			});
			await dcartDataSource.getRepository(Storymap).save(newStorymap);
			res.status(201).send(newStorymap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// met à jour une storymap
	updateStorymap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { storymapId } = req.params;
			const { tags } = req.body;

			const storymapToUpdate = await dcartDataSource
				.getRepository(Storymap)
				.findOne({
					where: { id: storymapId },
				});

			if (!storymapToUpdate) {
				res.status(404).send("Storymap non trouvée.");
				return;
			}

			const { userId } = req.user as jwt.JwtPayload;
			storymapToUpdate.modifier = userId;

			if (req.query.isActive) {
				if (req.user?.userStatus !== "admin") {
					res.status(403).send("Accès refusé");
					return;
				}
				const updatedStorymap = await dcartDataSource
					.getRepository(Storymap)
					.create({
						...storymapToUpdate,
						isActive: req.query.isActive === "true",
					});

				const newStorymap = await dcartDataSource
					.getRepository(Storymap)
					.save(updatedStorymap);

				res.status(200).send(newStorymap);
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

			if (storymapToUpdate.title_lang1 !== req.body.title_lang1) {
				const newSlug = await generateUniqueSlug(
					req.body.title_lang1,
					dcartDataSource.getRepository(Storymap),
				);
				req.body.slug = newSlug;
			}

			const updatedStorymap = await dcartDataSource
				.getRepository(Storymap)
				.create({
					...storymapToUpdate,
					...req.body,
					tags: tagsToSave,
				});

			const newStorymap = await dcartDataSource
				.getRepository(Storymap)
				.save(updatedStorymap);

			res.status(200).send(newStorymap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// supprime une storymap
	deleteStorymap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { storymapId } = req.params;

			const storymapToDelete = await dcartDataSource
				.getRepository(Storymap)
				.findOne({
					where: { id: storymapId },
				});

			if (!storymapToDelete) {
				res.status(404).send("Storymap non trouvée.");
				return;
			}

			await dcartDataSource.getRepository(Storymap).delete(storymapId);

			res.status(200).send("Storymap supprimée.");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
