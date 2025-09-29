import { Router } from "express";
import multer from "multer";
import { createTopProductsFromExcel, getTopProducts, removeProductFromTopProduct } from "../controllers/topProducts.controller.js";

const storage = multer.memoryStorage(); // In-memory buffer
const upload = multer({ storage });

const router = Router()

router.route("/create" ).post(upload.single('file'), createTopProductsFromExcel)
router.route("/").get(getTopProducts)
router.delete("/:productId", removeProductFromTopProduct);

export default router;