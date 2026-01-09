const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const connectDB = require("../config/mongoConfig")
const User = require("../model/user")
dotenv.config()
async function seedUsers() {
  try {
    await connectDB()

    const users = [
      {
        name: "System Admin",
        email: "admin@ereport.com",
        password: "Test@123",
        role: "ADMIN"
      },
      {
        name: "Field Officer",
        email: "officer@ereport.com",
        password: "Test@123",
        role: "OFFICER"
      }
    ]

    for (const u of users) {
      const exists = await User.findOne({ email: u.email })
      if (exists) {
        console.log(`User already exists: ${u.email}`)
        continue
      }

      const hash = await bcrypt.hash(u.password, 10)

      await User.create({
        name: u.name,
        email: u.email,
        passwordHash: hash,
        role: u.role,
        isActive: true
      })

      console.log(`User created: ${u.email}`)
    }

    console.log("Seeding completed")
    process.exit(0)
  } catch (err) {
    console.error("Seeding failed:", err)
    process.exit(1)
  }
}

seedUsers();