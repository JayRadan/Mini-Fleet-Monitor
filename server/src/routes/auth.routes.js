// STEP 1: Create Express router.
// STEP 2: Implement POST /login.
// STEP 3: Read email/password from req.body.
// STEP 4: Query user by email from DB.
// STEP 5: Compare password with stored hash.
// STEP 6: Sign and return JWT on success.
// STEP 7: Return 401 on invalid credentials.

import express from "express";
import { signAccessToken } from "../utils/jwt.js";
import prisma from "../config/prisma.js";
import { comparePassword } from "../utils/hash.js";

const router = express.Router();

router.post("/login", async (_req, res,next) => {
  try {
    const { email, password } = _req.body;

    if (!email || !password) {
      return next({ message: "Email and password are required", status: 400 });
    }

    const findUser = await prisma.user.findUnique({ where: { email } });
    if (!findUser) {
      return next({ message: "Invalid credentials", status: 401 });
    }

    const isPasswordValid = await comparePassword(password, findUser.passwordHash);
    if (!isPasswordValid) {
      return next({ message: "Invalid credentials", status: 401 });
    }
    const token = signAccessToken({ id: findUser.id, email: findUser.email });
    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
    // i set it in cookies becasue the localstorage is vulnerable to XSS attacks and it's generally recommended to store JWTs in httpOnly cookies for better security.
    res.cookie("token", token, options);

    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
});

export default router;
