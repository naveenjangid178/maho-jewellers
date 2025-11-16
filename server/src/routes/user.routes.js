import { Router } from "express";
import { getAllUsers, getUserAllowedCatalogues, loginUser, updateUserCatalogues, updateUserRequestCatalogues, verifyOtp } from "../controllers/user.controller.js";
import { createUserProductView } from "../controllers/userProductView.controller.js";

const router = Router()

router.route("/login").post(loginUser)
router.route("/verify").post(verifyOtp)
router.route("/product-view").post(createUserProductView)
router.route("/").get(getAllUsers)
router.get('/:userId/allowed-catalogues', getUserAllowedCatalogues);
router.route("/product-view").post(createUserProductView)
router.put('/:id/catalogues', updateUserCatalogues);
router.put('/:id/request-catalogues', updateUserRequestCatalogues);

export default router;