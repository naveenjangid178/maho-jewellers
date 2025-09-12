import { Router } from "express";
import { addItemToCart, clearCart } from "../controllers/cart.controller.js";

const router = Router()

router.route("/").post(addItemToCart)
router.route("/clear").post(clearCart)

export default router;