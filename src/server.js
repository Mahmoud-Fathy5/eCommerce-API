import express from "express"
import cookieParser from "cookie-parser"
import logger from "./utils/logger.js"
import { connectDB } from "./config/db.js"

//import Routes
import shopping from "./Routes/shopping.js"
import auth from "./Routes/auth.js"
import order from "./Routes/order.js"

// Connect to database
connectDB()

const app = express()



//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


//routes
app.use("/shopping", shopping)
app.use("/auth", auth)
app.use("/order", order)

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
    logger.info(`Server Running on PORT ${PORT}`)
})
