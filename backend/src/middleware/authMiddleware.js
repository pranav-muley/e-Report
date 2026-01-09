import jwtUtil from "../utils/jwt"

export default function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth) throw new Error("Unauthorized")

    const token = auth.split(" ")[1]
    const payload = jwtUtil.verifyAccessToken(token)

    req.user = payload
    next()
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" })
  }
}