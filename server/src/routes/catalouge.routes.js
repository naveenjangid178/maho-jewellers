import { Router } from "express";
import { createCatalogue, getAllCatalogues, getCatalogueDetails, updateCatalogue } from "../controllers/catalouge.controller.js";
import multer from "multer";

const storage = multer.memoryStorage(); // In-memory buffer
const upload = multer({ storage });

const router = Router()

router.route("/create" ).post(upload.single('image'), createCatalogue)
router.route("/:id").get(getCatalogueDetails)
router.route("/").get(getAllCatalogues)
router.route("/update/:id" ).put(upload.single('image'), updateCatalogue)

export default router;