const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const User = require("../model/user")
const RefreshToken = require("../model/refreshToken")

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require("../utils/jwt")

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

async function login({ email, password, userAgent, ip }) {
  const user = await User.findOne({ email, isActive: true })
  if (!user) throw new Error("Invalid credentials")

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) throw new Error("Invalid credentials")

  const payload = {
    id: user._id,
    role: user.role
  }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    userAgent,
    ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  return { user, accessToken, refreshToken }
}

async function refresh({ refreshToken }) {
  const payload = verifyRefreshToken(refreshToken)
  const tokenHash = hashToken(refreshToken)

  const tokenDoc = await RefreshToken.findOne({
    userId: payload.id,
    tokenHash
  })

  if (!tokenDoc) throw new Error("Invalid refresh token")

  // rotate token
  await tokenDoc.deleteOne()

  const newAccessToken = signAccessToken({
    id: payload.id,
    role: payload.role
  })

  const newRefreshToken = signRefreshToken({
    id: payload.id,
    role: payload.role
  })

  await RefreshToken.create({
    userId: payload.id,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

async function logout({ refreshToken }) {
  if (!refreshToken) return

  await RefreshToken.deleteOne({
    tokenHash: hashToken(refreshToken)
  })
}

module.exports = {
  login,
  refresh,
  logout
}
