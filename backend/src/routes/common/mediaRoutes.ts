import { Router } from "express";
import multer from "multer";
import { mediaController } from "../../controllers/common/mediaController";
import { authenticateUser } from "../../middlewares/authenticate";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images sont autorisées."));
    }
  },
});

router.post(
  "/upload",
  authenticateUser,
  upload.single("file"),
  mediaController.uploadImage
);

router.delete("/:filename", authenticateUser, mediaController.deleteImage);

export { router as mediaRoutes };
