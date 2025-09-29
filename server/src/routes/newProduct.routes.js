import { Router } from "express";
import multer from "multer";
import { createNewProductsFromExcel, getNewProducts, removeProductFromNewProduct } from "../controllers/newProducts.controller.js";

const storage = multer.memoryStorage(); // In-memory buffer
const upload = multer({ storage });

const router = Router()

router.route("/create" ).post(upload.single('file'), createNewProductsFromExcel)
router.route("/").get(getNewProducts)
router.delete("/:productId", removeProductFromNewProduct);

export default router;