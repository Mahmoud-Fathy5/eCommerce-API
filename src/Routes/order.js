import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from "../controllers/orderControllers.js";

const router = express.Router()

router.use(authMiddleware)

router.get("/", getAllOrders)
router.get("/:id", getOrder)
router.post("/", addOrder)
router.patch("/:id", updateOrder)
router.delete("/:id", deleteOrder)



export default router