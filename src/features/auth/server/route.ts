import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { AUTH_COOKIE } from "../constants";
import { user } from "@/db/schema";
import { z } from "zod";
import { insertUserSchema } from "../schemas";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    try {
      const userId = c.get("userId") as string;
      const userFound = await db.select().from(user).where(eq(user.id, userId));
      if (userFound.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: userFound[0] });
    } catch (error) {
      console.log("Error while getting current user", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .get("/current", sessionMiddleware, async (c) => {
    try {
      const userId = c.get("userId") as string;
      const userFound = await db.select().from(user).where(eq(user.id, userId));
      if (userFound.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: userFound[0] });
    } catch (error) {
      console.log("Error while getting current user", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .post(
    "/login",
    zValidator("json", z.object({ email: z.string(), password: z.string() })),
    async (c) => {
      const { email, password } = c.req.valid("json");
      try {
        const userFound = await db
          .select()
          .from(user)
          .where(eq(user.email, email));
        if (userFound.length === 0) {
          return c.json(
            { error: "Unauthorized", message: "User not found" },
            401
          );
        }
        const isPasswordValid = await bcrypt.compare(
          password!,
          userFound[0].password
        );
        if (!isPasswordValid) {
          return c.json(
            { error: "Unauthorized", message: "Incorrect password" },
            401
          );
        }
        const token = jwt.sign(
          { email, id: userFound[0].id },
          process.env.JWT_SECRET! as string,
          {
            expiresIn: "7d",
          }
        );
        setCookie(c, AUTH_COOKIE, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "Strict",
        });
        return c.json({ email, password });
      } catch (err) {
        console.log("Error while login", err);
        return c.json(
          { error: "InternalServerError", message: "Internal Server Error" },
          500
        );
      }
    }
  )
  .post("/register", zValidator("form", insertUserSchema), async (c) => {
    const {
      name,
      email,
      phoneNumber,
      password,
      image,
      businessLocation,
      businessIndustry,
      businessBio,
      businessEmail,
      businessPhone,
      businessWebsite,
      businessLicense,
      authorizationLetter,
      businessAddress,
      confirmPassword,
    } = c.req.valid("form");
    const hashedPassword = await bcrypt.hash(password, 10);
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !password ||
      !businessIndustry ||
      !businessLocation ||
      !businessEmail ||
      !businessPhone ||
      !businessLicense ||
      !authorizationLetter ||
      !businessAddress ||
      !confirmPassword
    ) {
      return c.json(
        { error: "BadRequest", message: "All fields are required" },
        400
      );
    }

    try {
      const [createdUser] = await db
        .insert(user)
        .values({
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          image,
          businessIndustry,
          businessLocation,
          businessEmail,
          businessPhone,
          businessAddress,
          businessStatus: "PENDING",
          businessBio: businessBio || "",
          businessWebsite: businessWebsite || "",
          businessLicense,
          authorizationLetter,
          confirmPassword: hashedPassword,
        })
        .returning();
      return c.json({ data: createdUser });
    } catch (err) {
      if (err instanceof NeonDbError && err.code === "23505") {
        console.error("Email already exists", err);
        return c.json(
          {
            error: "ConflictError",
            message: "Email already exists.",
          },
          409
        );
      }
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    try {
      deleteCookie(c, AUTH_COOKIE);
      return c.json({ message: "Logged out successfully" });
    } catch (err) {
      console.log("Error while logout", err);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .get("/:userId", sessionMiddleware, async (c) => {
    const userId = c.req.param("userId");
    if (!userId) {
      return c.json(
        { error: "BadRequest", message: "User ID is required" },
        400
      );
    }
    try {
      const userFound = await db.select().from(user).where(eq(user.id, userId));
      if (userFound.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: userFound[0] });
    } catch (error) {
      console.log("Error while getting user by ID", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  });

export default app;
