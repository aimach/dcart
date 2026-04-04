// import des entités
import { Point, Storymap } from "../../entities";
import { User } from "../../entities/auth/User";
import { MapContent } from "../../entities/builtMap/MapContent";
import { Attestation } from "../../entities/common/Attestation";
import { Color } from "../../entities/common/Color";
import { Icon } from "../../entities/common/Icon";
import { Block } from "../../entities/storymap/Block";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
import { arrayMove } from "../../utils/functions/builtMap";
// import des types
import type { Request, Response } from "express";
import type { CustomPointType } from "../../utils/types/mapTypes";

type NormalizedCustomPoint = {
  latitude: number;
  longitude: number;
  location: string | null;
  source_nb: number | null;
};

const parseCoordinate = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number.parseFloat(value.replace(",", "."));
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return null;
};

function validateCustomPointsArray(
  points: CustomPointType[],
):
  | { ok: true; normalized: NormalizedCustomPoint[] }
  | { ok: false; message: string } {
  const normalized: NormalizedCustomPoint[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    console.log("p", p);
    const latitude = parseCoordinate(p?.latitude);
    const longitude = parseCoordinate(p?.longitude);
    console.log("latitude", latitude);
    console.log("longitude", longitude);
    if (latitude === null || longitude === null) {
      return {
        ok: false,
        message: `Point personnalisé ${i + 1} : latitude et longitude numériques requises`,
      };
    }
    let source_nb: number | null = null;
    const raw = p as CustomPointType & { source_nb?: unknown };
    if (raw.source_nb !== undefined && raw.source_nb !== null) {
      const sn =
        typeof raw.source_nb === "number"
          ? raw.source_nb
          : Number.parseInt(String(raw.source_nb), 10);
      if (!Number.isFinite(sn)) {
        return {
          ok: false,
          message: `Point personnalisé ${i + 1} : source_nb invalide`,
        };
      }
      source_nb = sn;
    }
    const loc = p?.location;
    normalized.push({
      latitude,
      longitude,
      location:
        loc !== undefined && loc !== null && String(loc).trim() !== ""
          ? String(loc)
          : null,
      source_nb,
    });
  }
  return { ok: true, normalized };
}

export const attestationController = {
  // récupère toutes les attestations d'une carte
  getAttestationsByMapId: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { mapId } = req.params;

      let results = null;

      results = await dcartDataSource
        .getRepository(Attestation)
        .findOneBy({ id: mapId });

      if (!results) {
        res.status(404).json("Aucune attestation pour cette carte");
      }

      res.status(200).json(results);
    } catch (error) {
      handleError(res, error as Error);
    }
  },

  // créer une liste d'attestation
  createAttestationList: async (req: Request, res: Response): Promise<void> => {
    try {
      const { color, icon, mapId, blockId, customPointsArray } = req.body;

      const parentRepository = mapId
        ? dcartDataSource.getRepository(MapContent)
        : dcartDataSource.getRepository(Block);
      const parentId = mapId ? mapId : blockId;

      if (!parentId) {
        res.status(400).json("L'id de la carte ou du bloc est requis");
        return;
      }
      const parentToAddAttestations = await parentRepository.findOne({
        where: { id: parentId },
      });
      if (!parentToAddAttestations) {
        res.status(404).json("La carte ou le bloc n'existe pas");
        return;
      }

      let iconToAdd = null;
      if (!icon) {
        iconToAdd = await dcartDataSource
          .getRepository(Icon)
          .findOne({ where: { name_fr: "cercle" } });
      } else {
        iconToAdd = await dcartDataSource
          .getRepository(Icon)
          .findOne({ where: { id: icon } });
      }

      if (!iconToAdd) {
        res.status(404).json("L'icône n'existe pas");
        return;
      }

      let colorToAdd = null;
      if (!color) {
        colorToAdd = await dcartDataSource
          .getRepository(Color)
          .findOne({ where: { name_fr: "marron" } });
      } else {
        colorToAdd = await dcartDataSource
          .getRepository(Color)
          .findOne({ where: { id: req.body.color } });
      }

      if (!colorToAdd) {
        res.status(404).json("La couleur n'existe pas");
        return;
      }

      let normalizedCustomPoints: NormalizedCustomPoint[] | undefined;
      if (customPointsArray && customPointsArray.length > 0) {
        const checked = validateCustomPointsArray(customPointsArray);
        if (!checked.ok) {
          res.status(400).json({ message: checked.message });
          return;
        }
        normalizedCustomPoints = checked.normalized;
      }

      const attestationLastPosition = await dcartDataSource
        .getRepository(Attestation)
        .createQueryBuilder("attestation")
        .select("MAX(attestation.position)", "maxPosition")
        .where("attestation.mapId = :mapId OR attestation.blockId = :blockId", {
          mapId: mapId || null,
          blockId: blockId || null,
        })
        .getRawOne();

      const newAttestation = await dcartDataSource
        .getRepository(Attestation)
        .save({
          ...req.body,
          attestationIds: req.body.attestationIds || "",
          icon: iconToAdd,
          [mapId ? "map" : "block"]: parentToAddAttestations,
          color: colorToAdd,
          lastActivity: new Date(),
          position: attestationLastPosition.maxPosition
            ? attestationLastPosition.maxPosition + 1
            : 1,
        });

      if (normalizedCustomPoints && normalizedCustomPoints.length > 0) {
        const pointRepository = dcartDataSource.getRepository(Point);
        await Promise.all(
          normalizedCustomPoints.map((pointData) =>
            pointRepository.save(
              pointRepository.create({
                latitude: pointData.latitude,
                longitude: pointData.longitude,
                location: pointData.location,
                ...(pointData.source_nb !== null
                  ? { source_nb: pointData.source_nb }
                  : {}),
                attestation: newAttestation,
              }),
            ),
          ),
        );
      }

      if (mapId) {
        const user = await dcartDataSource
          .getRepository(User)
          .findOneBy({ id: req.user?.userId || "" });

        // mise à jour de la date de modification de la carte
        await dcartDataSource.getRepository(MapContent).update(mapId, {
          updatedAt: new Date(),
          modifier: user || null,
        });
      }

      res.status(201).json(newAttestation);
    } catch (error) {
      handleError(res, error as Error);
    }
  },

  // modifier une liste d'attestation
  modifyAttestationList: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { color, icon, mapId, blockId, customPointsArray } = req.body;
      const { position } = req.query;

      if (position) {
        const pointSetId = id;

        let whereBody = {};
        if (mapId && !blockId) {
          whereBody = { map: { id: mapId } };
        }
        if (blockId && !mapId) {
          whereBody = { block: { id: blockId } };
        }

        const allPointSets = await dcartDataSource
          .getRepository(Attestation)
          .find({
            where: whereBody,
            order: { position: "ASC" },
          });

        const oldIndex = allPointSets.findIndex(
          (pointSet) => pointSet.id.toString() === pointSetId.toString(),
        );
        if (oldIndex === -1) {
          res.status(404).json("Le jeu d'attestations n'existe pas");
          return;
        }
        const newIndex = Number.parseInt(position as string, 10) - 1;

        const newOrder = arrayMove(allPointSets, oldIndex, newIndex);

        for (let i = 0; i < newOrder.length; i++) {
          newOrder[i].position = i + 1;
        }

        await dcartDataSource.getRepository(Attestation).save(newOrder);
        res.status(200).json("Ordre des attestations mis à jour");
        return;
      }

      const parentRepository = mapId
        ? dcartDataSource.getRepository(MapContent)
        : dcartDataSource.getRepository(Block);
      const parentId = mapId ? mapId : blockId;

      if (!parentId) {
        res.status(400).json("L'id de la carte ou du bloc est requis");
        return;
      }
      const parentToAddAttestations = await parentRepository.findOne({
        where: { id: parentId },
      });
      if (!parentToAddAttestations) {
        res.status(404).json("La carte ou le bloc n'existe pas");
        return;
      }

      let iconToAdd = null;
      if (!icon) {
        iconToAdd = await dcartDataSource
          .getRepository(Icon)
          .findOne({ where: { name_fr: "cercle" } });
      } else {
        iconToAdd = await dcartDataSource
          .getRepository(Icon)
          .findOne({ where: { id: icon } });
      }

      if (!iconToAdd) {
        res.status(404).json("L'icône n'existe pas");
        return;
      }

      let colorToAdd = null;
      if (!color) {
        colorToAdd = await dcartDataSource
          .getRepository(Color)
          .findOne({ where: { name_fr: "marron" } });
      } else {
        colorToAdd = await dcartDataSource
          .getRepository(Color)
          .findOne({ where: { id: req.body.color } });
      }

      if (!colorToAdd) {
        res.status(404).json("La couleur n'existe pas");
        return;
      }

      let normalizedCustomPointsModify: NormalizedCustomPoint[] | undefined;
      if (customPointsArray && customPointsArray.length > 0) {
        const checked = validateCustomPointsArray(customPointsArray);
        if (!checked.ok) {
          res.status(400).json({ message: checked.message });
          return;
        }
        normalizedCustomPointsModify = checked.normalized;
      }

      const attestationListToUpdate = await dcartDataSource
        .getRepository(Attestation)
        .findOneBy({ id });
      if (!attestationListToUpdate) {
        res.status(404).json("Le jeu d'attestations n'existe pas");
        return;
      }

      attestationListToUpdate.icon = iconToAdd;
      attestationListToUpdate.color = colorToAdd;
      attestationListToUpdate.name_fr = req.body.name_fr;
      attestationListToUpdate.name_en = req.body.name_en;
      attestationListToUpdate.attestationIds = req.body.attestationIds;
      attestationListToUpdate.lastActivity = new Date();

      const updatedAttestation = await dcartDataSource
        .getRepository(Attestation)
        .save(attestationListToUpdate);

      if (
        normalizedCustomPointsModify &&
        normalizedCustomPointsModify.length > 0
      ) {
        const pointRepository = dcartDataSource.getRepository(Point);

        // Supprimer les points existants liés à cette attestation
        await pointRepository.delete({ attestation: updatedAttestation });

        await Promise.all(
          normalizedCustomPointsModify.map((pointData) =>
            pointRepository.save(
              pointRepository.create({
                latitude: pointData.latitude,
                longitude: pointData.longitude,
                location: pointData.location,
                ...(pointData.source_nb !== null
                  ? { source_nb: pointData.source_nb }
                  : {}),
                attestation: updatedAttestation,
              }),
            ),
          ),
        );
      }

      if (mapId) {
        const user = await dcartDataSource
          .getRepository(User)
          .findOneBy({ id: req.user?.userId || "" });

        // mise à jour de la date de modification de la carte
        await dcartDataSource.getRepository(MapContent).update(mapId, {
          updatedAt: new Date(),
          modifier: user || null,
        });
      }

      res.status(200).json("Le jeu d'attestations a bien été modifié");
    } catch (error) {
      handleError(res, error as Error);
    }
  },

  cleanAttestationList: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { mapType, pointType } = req.query;

      const attestationListToUpdate = await dcartDataSource
        .getRepository(Attestation)
        .findOne({ where: { id }, relations: ["map", "block"] });
      if (!attestationListToUpdate) {
        res.status(404).json("Le jeu d'attestations n'existe pas");
        return;
      }

      // vider le champ attestationIds
      if (pointType === "bdd") {
        attestationListToUpdate.attestationIds = "";
        await dcartDataSource
          .getRepository(Attestation)
          .save(attestationListToUpdate);

        // mise à jour de la date de dernière activité de la carte préconstruite
        if (mapType === "map") {
          await dcartDataSource
            .getRepository(MapContent)
            .update(attestationListToUpdate.map?.id as string, {
              updatedAt: new Date(),
            });
        }
      }

      // supprimer tous les points associés
      if (pointType === "custom") {
        await dcartDataSource
          .getRepository(Point)
          .delete({ attestation: attestationListToUpdate });
      }

      if (mapType === "storymap") {
        const blockToUpdate = await dcartDataSource
          .getRepository(Block)
          .findOne({
            where: { id: attestationListToUpdate.block?.id },
            relations: { storymap: true },
          });

        // mise à jour de la date de dernière activité
        await dcartDataSource
          .getRepository(Storymap)
          .update(blockToUpdate?.storymap.id as string, {
            updatedAt: new Date(),
          });
      }

      res
        .status(200)
        .json("Le jeu d'attestations a bien été vidé de ses points");
    } catch (error) {
      handleError(res, error as Error);
    }
  },

  // supprimer un jeu d'attestations
  deleteAttestationList: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const attestationListToDelete = await dcartDataSource
        .getRepository(Attestation)
        .findOne({
          where: { id },
          relations: {
            map: true,
            block: true,
          },
        });

      if (!attestationListToDelete) {
        res.status(404).json("Le jeu d'attestations n'existe pas");
        return;
      }

      if (attestationListToDelete.map) {
        const user = await dcartDataSource
          .getRepository(User)
          .findOneBy({ id: req.user?.userId || "" });

        // mise à jour de la date de modification de la carte
        await dcartDataSource
          .getRepository(MapContent)
          .update(attestationListToDelete.map.id, {
            updatedAt: new Date(),
            modifier: user || null,
          });
      }

      if (attestationListToDelete.block) {
        const user = await dcartDataSource
          .getRepository(User)
          .findOneBy({ id: req.user?.userId || "" });

        // mise à jour de la date de modification du bloc et de la storymap
        const blockRepository = dcartDataSource.getRepository(Block);
        const blockToUpdate = await blockRepository.findOne({
          where: { id: attestationListToDelete.block.id },
          relations: { storymap: true },
        });

        await blockRepository.update(attestationListToDelete.block.id, {
          updatedAt: new Date(),
        });

        await dcartDataSource
          .getRepository(Storymap)
          .update(blockToUpdate?.storymap.id as string, {
            updatedAt: new Date(),
            modifier: user || null,
          });
      }

      await dcartDataSource
        .getRepository(Attestation)
        .remove(attestationListToDelete);
      res.status(200).json("Le jeu d'attestations a bien été supprimé");
    } catch (error) {
      handleError(res, error as Error);
    }
  },
};
