import { Router } from "express";
import { createOrder, getAllOrders, getUserOrders } from "../controllers/order.controller.js";

const router = Router()

router.route("/create" ).post(createOrder)
router.route("/" ).get(getAllOrders)
router.route("/user-orders" ).post(getUserOrders)

export default router;