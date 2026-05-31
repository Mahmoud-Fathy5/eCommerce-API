import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addCart, getCart, removeCart, updateCart } from "../controllers/shoppingControllers.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/", addCart)
router.get("/", getCart)
router.patch("/cart", updateCart)
router.delete("/cart", removeCart)

export default router;