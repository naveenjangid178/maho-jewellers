import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import { seedDefaultAdmin } from "./utils/seedAdmin.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "50kb" }))
app.use(express.urlencoded({ extended: true, limit: "50kb" }))
app.use(express.static("public"))
app.use(cookieParser())
seedDefaultAdmin();

app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.META_SECRET;

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

//Routes import
import adminRouter from "./routes/admin.routes.js"
import userRouter from "./routes/user.routes.js"
import cartRouter from "./routes/cart.routes.js"
import catalougeRouter from "./routes/catalouge.routes.js"
import featuredRouter from "./routes/featured.routes.js"
import topProductRouter from "./routes/topProduct.routes.js"
import newProductRouter from "./routes/newProduct.routes.js"
import productRouter from "./routes/product.routes.js"
import blogRouter from "./routes/blog.routes.js"
import testimonialRouter from "./routes/testimonial.routes.js"
import sliderRouter from "./routes/slider.routes.js"
import requestAccessRouter from "./routes/requestAccess.routes.js"

// //Routes Declaration
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/catalouge", catalougeRouter)
app.use("/api/v1/featured", featuredRouter)
app.use("/api/v1/top-product", topProductRouter)
app.use("/api/v1/new-product", newProductRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/blog", blogRouter)
app.use("/api/v1/testimonial", testimonialRouter)
app.use("/api/v1/slider", sliderRouter)
app.use("/api/v1/request-access", requestAccessRouter)

export { app }