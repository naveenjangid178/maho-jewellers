import { Router } from "express";
import { addItemToCart, clearCart, getUserCart, removeItemFromCart, updateCartItemQuantity } from "../controllers/cart.controller.js";

const router = Router()

router.route("/:userId").get(getUserCart)
router.route("/").post(addItemToCart)
router.route("/remove").delete(removeItemFromCart)
router.route("/update-quantity").put(updateCartItemQuantity)
router.route("/clear").post(clearCart)

export default router;