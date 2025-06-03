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
			const { map, storymap } = req.query;

			let results = null;
			if (tagSlug === "all") {
				results = await dcartDataSource.getRepository(Tag).find();

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
				tagQuery = tagQuery
					.leftJoinAndSelect("tag.maps", "map", "map.isActive = true")
					.leftJoinAndSelect("map.tags", "mapTag");
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
				tagQuery = tagQuery
					.leftJoinAndSelect(
						"tag.storymaps",
						"storymap",
						"storymap.isActive = true",
					)
					.leftJoinAndSelect("storymap.tags", "storymapTag");
				selectArray.push(
					"storymap.id",
					"storymap.title_lang1",
					"storymap.title_lang2",
					"storymap.description_lang1",
					"storymap.description_lang2",
					"storymap.image_url",
					"storymap.slug",
					"storymapTag",
				);
			}

			tagQuery.select(selectArray);

			if (tagSlug === "items") {
				results = await tagQuery.getMany();

				res.status(200).json(results);
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
