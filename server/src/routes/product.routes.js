import { Router } from "express";
import { createProductAndAddToCatalogue, createProductsFromExcel, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
import multer from "multer";

const storage = multer.memoryStorage(); // In-memory buffer
const upload = multer({ storage });

const router = Router()

router.route("/create-add-to-catalouge").post(upload.single('images'), createProductAndAddToCatalogue)
router.route("/excel").post(upload.single('file'), createProductsFromExcel)
router.route("/").get(getAllProducts)
router.route("/:id").get(getProductById)
router.put('/:id', updateProduct);

export default router;