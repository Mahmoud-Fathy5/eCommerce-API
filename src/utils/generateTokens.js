import jwt from "jsonwebtoken"

const generateAccessToken = (userId, res) => {
    const payload = { id: userId }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    )
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
        maxAge: 1000 * 60 * 10,
        sameSite: "strict"
    })


    return token
}

const generateRefreshToken = (userId, res) => {
    const payload = { id: userId }
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "strict"
    })

    return token
}


export { generateAccessToken, generateRefreshToken }