import { prisma } from "../config/db.js"
import jwt from "jsonwebtoken"


const authMiddleware = async (req, res, next) => {
    let token

    const authHeader = req.headers.authorization || req.header("authorization");
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken
    }

    if (!token) {
        return res.status(401).json({ error: "Not Authorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        })
        if (!user) {
            return res.status(401).json({ error: "Not Authorized" })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ error: "Not Authorized" })
    }
}

export { authMiddleware }