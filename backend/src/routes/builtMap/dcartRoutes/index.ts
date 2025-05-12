// import des bibliothèques
import express from "express";
// import des routes
import { tagRoutes } from "./tagRoutes";
import { mapRoutes } from "./mapRoutes";
import { filterRoutes } from "./filterRoutes";
import { iconRoutes } from "../../common/iconRoutes";
import { attestationRoutes } from "../../common/attestationRoutes";
import { colorRoutes } from "../../common/colorRoutes";
import { divinityRoutes } from "../../common/divinityRoutes";

const dcartRoutes = express.Router();

dcartRoutes.use("/tags", tagRoutes);
dcartRoutes.use("/maps", mapRoutes);
dcartRoutes.use("/filters", filterRoutes);
dcartRoutes.use("/icons", iconRoutes);
dcartRoutes.use("/colors", colorRoutes);
dcartRoutes.use("/attestations", attestationRoutes);
dcartRoutes.use("/divinities", divinityRoutes);

export { dcartRoutes };
