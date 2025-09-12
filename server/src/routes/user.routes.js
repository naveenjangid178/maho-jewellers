import { Router } from "express";
import { getAllUsers, loginUser, updateUserCatalogues } from "../controllers/user.controller.js";
import { createUserProductView } from "../controllers/userProductView.controller.js";

const router = Router()

router.route("/login").post(loginUser)
router.route("/").get(getAllUsers)
router.route("/product-view").post(createUserProductView)
router.put('/:id/catalogues', updateUserCatalogues);

export default router;