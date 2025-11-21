import { Router } from "express";
import { createOrder, createOrderByAdmin, getAllOrders, getUserOrders } from "../controllers/order.controller.js";

const router = Router()

router.route("/create" ).post(createOrder)
router.route("/admin-create" ).post(createOrderByAdmin)
router.route("/" ).get(getAllOrders)
router.route("/user-orders" ).post(getUserOrders)

export default router;