import { Router } from "express";
import { createFeaturedProductsFromExcel, getFeaturedProducts, removeProductFromFeatured } from "../controllers/featured.controller.js";
import multer from "multer";

const storage = multer.memoryStorage(); // In-memory buffer
const upload = multer({ storage });

const router = Router()

router.route("/create" ).post(upload.single('file'), createFeaturedProductsFromExcel)
router.route("/").get(getFeaturedProducts)
router.delete("/:productId", removeProductFromFeatured);

export default router;