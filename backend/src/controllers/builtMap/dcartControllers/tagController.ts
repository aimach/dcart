// import des entités
import { Tag } from "../../../entities/common/Tag";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
import { generateUniqueSlug } from "../../../utils/functions/builtMap";
// import des types
import type { Request, Response } from "express";

export const tagController = {
	// récupère tous ou un tag en particulier
	getTags: async (req: Request, res: Response): Promise<void> => {
		try {
			const { tagSlug } = req.params;
			const { map, storymap, searchText, tags } = req.query;
			const page = Number.parseInt(req.query.page as string, 10) || null;
			const limit = Number.parseInt(req.query.limit as string, 10) || null;

			let results = null;
			if (tagSlug === "all") {
				results = await dcartDataSource.getRepository(Tag).find({
					order: {
						name_fr: "ASC",
						name_en: "ASC",
					},
				});

				res.status(200).json(results);
				return;
			}

			let tagQuery = await dcartDataSource
				.getRepository(Tag)
				.createQueryBuilder("tag");
			const selectArray = [
				"tag.id",
				"tag.name_fr",
				"tag.name_en",
				"tag.description_fr",
				"tag.description_en",
				"tag.slug",
			];

			if (map === "true" || map === undefined) {
				let condition = "map.isActive = true";
				if (searchText) {
					condition +=
						" AND (LOWER(map.title_fr) LIKE LOWER(:searchText) OR LOWER(map.title_en) LIKE LOWER(:searchText) OR LOWER(map.description_fr) LIKE LOWER(:searchText) OR LOWER(map.description_en) LIKE LOWER(:searchText))";
				}

				tagQuery = tagQuery
					.leftJoinAndSelect("tag.maps", "map", condition, {
						searchText: `%${searchText}%`,
					})
					.leftJoinAndSelect("map.tags", "mapTag");
				// .orderBy("GREATEST(map.createdAt, map.updatedAt)", "DESC");
				selectArray.push(
					"map.id",
					"map.title_fr",
					"map.title_en",
					"map.description_fr",
					"map.description_en",
					"map.image_url",
					"map.slug",
					"mapTag",
				);
			}

			if (storymap === "true" || storymap === undefined) {
				let condition = "storymap.isActive = true";
				if (searchText) {
					condition +=
						" AND (LOWER(storymap.title_lang1) LIKE LOWER(:searchText) OR LOWER(storymap.title_lang2) LIKE LOWER(:searchText) OR LOWER(storymap.description_lang1) LIKE LOWER(:searchText) OR LOWER(storymap.description_lang2) LIKE LOWER(:searchText))";
				}
				tagQuery = tagQuery
					.leftJoinAndSelect("tag.storymaps", "storymap", condition, {
						searchText: `%${searchText}%`,
					})
					.leftJoinAndSelect("storymap.tags", "storymapTag");
				// .orderBy("GREATEST(storymap.createdAt, storymap.updatedAt)", "DESC");
				selectArray.push(
					"storymap.id",
					"storymap.title_lang1",
					"storymap.title_lang2",
					"storymap.description_lang1",
					"storymap.description_lang2",
					"storymap.image_url",
					"storymap.background_color",
					"storymap.slug",
					"storymapTag",
				);
			}

			tagQuery.select(selectArray);

			if (tagSlug === "items") {
				if (tags) {
					const tagsArray = Array.isArray(tags)
						? tags
						: (tags as string).split(",").map((tag) => tag.trim());

					tagQuery.andWhere("tag.slug IN (:...tags)", { tags: tagsArray });
				}

				if (page && limit) {
					const offset = (page - 1) * limit;
					const [items, total] = await Promise.all([
						tagQuery.clone().skip(offset).take(limit).getMany(),
						tagQuery.clone().getCount(),
					]);

					const hasMore = page * limit < total;

					res.status(200).json({
						items,
						pagination: {
							page,
							limit,
							total,
							hasMore,
						},
					});
					return;
				}

				results = await tagQuery.getMany();

				res.status(200).json({ items: results });
				return;
			}

			results = await tagQuery
				.andWhere("tag.slug = :tagSlug", { tagSlug })
				.getOne();

			if (!results) {
				res.status(404).json("Aucun tag trouvé");
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupère toutes les tags avec les cartes associées
	getAllTagsWithMaps: async (req: Request, res: Response): Promise<void> => {
		try {
			const { tagId } = req.params;

			let results = null;
			if (tagId === "all") {
				results = await dcartDataSource
					.getRepository(Tag)
					.createQueryBuilder("tag")
					.innerJoin("tag.maps", "map") // Exclure les catégories sans cartes
					.select([
						"tag.id",
						"tag.name_fr",
						"tag.name_en",
						"tag.description_fr",
						"tag.description_en",
						"tag.slug",
						"map.id",
						"map.title_fr",
						"map.title_en",
						"map.description_fr",
						"map.description_en",
						"map.slug",
					])
					.where("map.isActive = true") // Exclure les cartes inactives
					.getMany();

				res.status(200).json(results);
				return;
			}

			// on vérifie que le tag existe
			const tag = await dcartDataSource
				.getRepository(Tag)
				.findOneBy({ id: tagId });

			if (!tag) {
				res.status(404).json("Aucun tag trouvé");
				return;
			}

			results = await dcartDataSource
				.getRepository(Tag)
				.createQueryBuilder("tag")
				.innerJoin("tag.maps", "map") // Exclure les catégories sans cartes
				.select([
					"tag.id",
					"tag.name_fr",
					"tag.name_en",
					"tag.description_fr",
					"tag.description_en",
					"tag.slug",
					"map.id",
					"map.title_fr",
					"map.title_en",
					"map.description_fr",
					"map.description_en",
					"map.slug",
				])
				.where({ id: tagId })
				.getOne();

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	createTag: async (req: Request, res: Response): Promise<void> => {
		try {
			const slug = await generateUniqueSlug(
				req.body.name_fr,
				dcartDataSource.getRepository(Tag),
			);
			req.body.slug = slug;
			const newTag = dcartDataSource.getRepository(Tag).create(req.body);
			const createdTag = await dcartDataSource.getRepository(Tag).save(newTag);
			res.status(201).json(createdTag);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	updateTag: async (req: Request, res: Response): Promise<void> => {
		const { tagId } = req.params;

		try {
			const tagToUpdate = await dcartDataSource
				.getRepository(Tag)
				.findOneBy({ id: tagId });

			if (!tagToUpdate) {
				res.status(404).json("Aucune étiquette trouvée");
				return;
			}

			if (tagToUpdate.name_fr !== req.body.name_fr) {
				const newSlug = await generateUniqueSlug(
					req.body.name_fr,
					dcartDataSource.getRepository(Tag),
				);
				req.body.slug = newSlug;
			}

			const updatedTag = await dcartDataSource
				.getRepository(Tag)
				.merge(tagToUpdate, req.body);

			await dcartDataSource.getRepository(Tag).save(updatedTag);

			res.status(200).json(updatedTag);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	deleteTag: async (req: Request, res: Response): Promise<void> => {
		const { tagId } = req.params;

		try {
			const tagToDelete = await dcartDataSource
				.getRepository(Tag)
				.findOneBy({ id: tagId });

			if (!tagToDelete) {
				res.status(404).json("Aucune étiquette trouvée");
				return;
			}

			await dcartDataSource.getRepository(Tag).delete(tagToDelete.id);

			res.status(200).send("Étiquette supprimée avec succès");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
