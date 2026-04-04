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
import { deleteImage, isLocalImageUrl } from "../../utils/media/imageProcessor";
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
          .leftJoinAndSelect(
            "attestations.customPointsArray",
            "customPointsArray"
          )
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
            "customPointsArray",
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
            token as string
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
            { userId: authenticatedUser.id }
          );
        }

        if (searchText) {
          query.andWhere(
            "(storymap.title_lang1 ILIKE :searchText OR storymap.title_lang2 ILIKE :searchText OR storymap.description_lang1 ILIKE :searchText OR storymap.description_lang2 ILIKE :searchText OR creator.username ILIKE :searchText OR modifier.username ILIKE :searchText)",
            { searchText: `%${searchText}%` }
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
        .leftJoinAndSelect(
          "attestations.customPointsArray",
          "customPointsArray"
        )
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
          "customPointsArray",
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
          (block) => block.position !== null && block.type?.name !== "step"
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
        dcartDataSource.getRepository(Storymap)
      );

      const newStorymap = dcartDataSource.getRepository(Storymap).create({
        ...req.body,
        slug,
        tags: tagsToSave,
        creator: userId,
      });
      const savedStorymap = await dcartDataSource
        .getRepository(Storymap)
        .save(newStorymap);
      res.status(201).send(savedStorymap);
    } catch (error) {
      handleError(res, error as Error);
    }
  },

  // met à jour une storymap
  updateStorymap: async (req: Request, res: Response): Promise<void> => {
    try {
      const { storymapId } = req.params;
      const { tags, image_url } = req.body;

      const storymapToUpdate = await dcartDataSource
        .getRepository(Storymap)
        .findOne({
          where: { id: storymapId },
        });

      if (!storymapToUpdate) {
        res.status(404).send("Storymap non trouvée.");
        return;
      }

      // Gestion de la suppression de l'ancienne image
      // Si une nouvelle URL est fournie et qu'elle est différente de l'ancienne
      // OU si l'image est vide (suppression explicite par l'utilisateur)
      if (
        storymapToUpdate.image_url &&
        image_url !== undefined && // Le champ a été envoyé dans la requête
        storymapToUpdate.image_url !== image_url // Et il est différent de ce qu'on a en base
      ) {
        try {
          await deleteImage(storymapToUpdate.image_url);
        } catch (err) {
          console.error(
            "Erreur lors de la suppression de l'ancienne image",
            err
          );
          // On continue quand même la mise à jour, ce n'est pas bloquant
        }
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
          dcartDataSource.getRepository(Storymap)
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

      // Récupérer la storymap avec ses blocs et leurs relations
      const storymapToDelete = await dcartDataSource
        .getRepository(Storymap)
        .findOne({
          where: { id: storymapId },
          relations: {
            blocks: {
              type: true,
              children: {
                type: true,
              },
            },
          },
        });

      if (!storymapToDelete) {
        res.status(404).send("Storymap non trouvée.");
        return;
      }

      // Ensemble pour stocker les URLs d'images uniques à supprimer
      const imageUrlsToDelete = new Set<string>();

      // 1. Supprimer l'image d'introduction si elle existe et est locale
      if (storymapToDelete.image_url) {
        if (isLocalImageUrl(storymapToDelete.image_url)) {
          imageUrlsToDelete.add(storymapToDelete.image_url);
        }
      }

      // 2. Parcourir tous les blocs de la storymap
      if (storymapToDelete.blocks && storymapToDelete.blocks.length > 0) {
        for (const block of storymapToDelete.blocks) {
          // Si le bloc est de type "image", supprimer son image
          if (block.type?.name === "image") {
            // Ajouter content1_lang1 si c'est une URL locale
            if (block.content1_lang1) {
              const isLocal = isLocalImageUrl(block.content1_lang1);
              if (isLocal) {
                imageUrlsToDelete.add(block.content1_lang1);
              }
            }
            // Ajouter content1_lang2 si c'est une URL locale différente de content1_lang1
            if (
              block.content1_lang2 &&
              block.content1_lang2 !== block.content1_lang1
            ) {
              const isLocal = isLocalImageUrl(block.content1_lang2);
              if (isLocal) {
                imageUrlsToDelete.add(block.content1_lang2);
              }
            }
          }

          // Si le bloc est de type "layout", parcourir ses enfants
          if (block.type?.name === "layout" && block.children) {
            for (const child of block.children) {
              // Si l'enfant est de type "image", supprimer son image
              if (child.type?.name === "image") {
                if (child.content1_lang1) {
                  const isLocal = isLocalImageUrl(child.content1_lang1);
                  if (isLocal) {
                    imageUrlsToDelete.add(child.content1_lang1);
                  }
                }
                // Ajouter content1_lang2 si c'est une URL locale différente
                if (
                  child.content1_lang2 &&
                  child.content1_lang2 !== child.content1_lang1
                ) {
                  const isLocal = isLocalImageUrl(child.content1_lang2);
                  if (isLocal) {
                    imageUrlsToDelete.add(child.content1_lang2);
                  }
                }
              }
            }
          }
        }
      }

      // 3. Supprimer toutes les images identifiées (avec gestion d'erreur individuelle)
      for (const imageUrl of imageUrlsToDelete) {
        try {
          await deleteImage(imageUrl);
        } catch (err) {
          // On continue même si une image ne peut pas être supprimée
        }
      }

      // 4. Supprimer la storymap de la base de données
      await dcartDataSource.getRepository(Storymap).delete(storymapId);

      res.status(200).send("Storymap supprimée.");
    } catch (error) {
      handleError(res, error as Error);
    }
  },
};
