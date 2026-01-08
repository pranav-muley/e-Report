const authService = require("../service/authService")

async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const { user, accessToken, refreshToken } =
            await authService.login({
                email,
                password,
                userAgent: req.headers["user-agent"],
                ip: req.ip
            })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        res.json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        })
    } catch (err) {
        next(err)
    }
}

async function refresh(req, res, next) {
    try {
        const token = req.cookies?.refreshToken

        if (!token) {
            return res.status(401).json({ message: "Refresh token missing" })
        }

        const result = await authService.refresh({ refreshToken: token })
        res.json({ success: true, accessToken: result.accessToken })
    } catch (err) {
        next(err)
    }
}

async function logout(req, res, next) {
    try {
        const token = req.cookies?.refreshToken

        if (token) {
            await authService.logout({ refreshToken: token })
        }

        res.clearCookie("refreshToken")
        res.json({ success: true })
    } catch (err) {
        next(err)
    }
}

module.exports = { login, refresh, logout }