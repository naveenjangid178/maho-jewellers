import { Router } from "express";
import { createCatalogue, deleteCatalogue, getAllCatalogues, getCatalogueDetails, removeProductFromCatalogue, updateCatalogue } from "../controllers/catalouge.controller.js";
import multer from "multer";

const storage = multer.memoryStorage(); // In-memory buffer
const upload = multer({ storage });

const router = Router()

router.route("/create" ).post(upload.single('image'), createCatalogue)
router.route("/:id").get(getCatalogueDetails)
router.route("/").get(getAllCatalogues)
router.route("/update/:id" ).put(upload.single('image'), updateCatalogue)
router.delete("/:catalogueId/product/:productId", removeProductFromCatalogue);
router.delete("/:catalogueId", deleteCatalogue);

export default router;