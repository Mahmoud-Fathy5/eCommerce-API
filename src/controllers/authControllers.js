import { prisma } from "../config/db.js"
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"
import jwt from "jsonwebtoken"


const register = async (req, res) => {
    const { name, email, password } = req.body
    const userExist = await prisma.user.findUnique({
        where: { email: email }
    })
    if (userExist) {
        return res.status(400).json({ error: "Email Already Exists" })
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    //create user
    const user = await prisma.user.create({
        data: {
            username: name,
            email,
            password: hashedPass,
        }
    })
    const accessToken = generateAccessToken(user.id, res)
    const refreshToken = generateRefreshToken(user.id, res)
    const userUpdated = await prisma.user.update({
        where: { id: user.id },
        data: {
            refreshToken: refreshToken
        }
    })

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email,
                name
            },
        }
    })
}


const login = async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({
        where: { email: email }
    })

    if (!user) {
        return res.status(401).json({ error: "Invalid Email or Password" })
    }

    const validPass = await bcrypt.compare(password, user.password)

    if (!validPass) {
        return res.status(401).json({ error: "Invalid Email or Password" })
    }

    //generating tokens
    const accessToken = generateAccessToken(user.id, res)
    const refreshToken = generateRefreshToken(user.id, res)

    //updating the refresh token in the db
    const updateUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            refreshToken: refreshToken
        }
    })

    res.status(201).json({
        status: "success",
        data: {
            id: user.id,
            name: user.username,
            email: user.email
        }
    })
}

const logout = async (req, res) => {

    let token
    if (!req.cookies?.refreshToken) {
        return res.status(200).json({
            status: "success",
            message: "logged out successfully"
        })
    }
    token = req.cookies.refreshToken
    res.clearCookie("refreshToken")
    try {

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const user = await prisma.user.update({
            where: { id: decoded.id },
            data: {
                refreshToken: null
            }
        })

    } catch (err) {

        const user = await prisma.user.updateMany({
            where: { refreshToken: token },
            data: {
                refreshToken: null
            }
        })

    }

    res.status(200).json({
        status: "success",
        message: "logged out successfully"
    })
}

const refresh = async (req, res) => {
    try {
        if (req.cookies?.refreshToken) {
            const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const user = await prisma.user.findFirst({
                where: { id: decoded.id, refreshToken: req.cookies.refreshToken }
            })


            if (!user) {
                return res.status(401).json({ error: "Invalid Token" })
            }

            generateAccessToken(user.id, res)
            return res.status(201).json({ message: "Token generated successfully" })
        }
        else {
            res.status(401).json({ error: "Invalid Token" })
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid Token" })
    }
}

export { register, login, logout, refresh }