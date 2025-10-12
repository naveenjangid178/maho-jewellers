import { Router } from "express";
import { loginAdmin } from "../controllers/admin.controller.js";
import { getAllUserProductViews } from "../controllers/userProductView.controller.js";

const router = Router()

router.route("/login").post(loginAdmin)
router.route('/user-product-views').get(getAllUserProductViews);


export default router;