// import des bibliothèques
import express from "express";
// import des routes
import { categoryRoutes } from "./categoryRoutes";
import { mapRoutes } from "./mapRoutes";
import { filterRoutes } from "./filterRoutes";
import { iconRoutes } from "../../common/iconRoutes";
import { attestationRoutes } from "../../common/attestationRoutes";
import { colorRoutes } from "../../common/colorRoutes";

const dcartRoutes = express.Router();

dcartRoutes.use("/categories", categoryRoutes);
dcartRoutes.use("/maps", mapRoutes);
dcartRoutes.use("/filters", filterRoutes);
dcartRoutes.use("/icons", iconRoutes);
dcartRoutes.use("/colors", colorRoutes);
dcartRoutes.use("/attestations", attestationRoutes);

export { dcartRoutes };
