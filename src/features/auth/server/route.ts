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
import { insertUserSchema, updateUserSchema } from "../schemas";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailNotification = async (
  to: string,
  status: "ACTIVE" | "REJECTED",
  userName: string
) => {
  const subject =
    status === "ACTIVE"
      ? "Your Account Has Been Approved"
      : "Your Account Verification Status";
  const html =
    status === "ACTIVE"
      ? `
        <h1>Hello, ${userName}</h1>
        <p>Congratulations! Your account has been successfully verified and is now active.</p>
        <p>You can now access all features of our platform.</p>
        <p>Thank you for joining us!</p>
      `
      : `
        <h1>Hello, ${userName}</h1>
        <p>We regret to inform you that your account verification has been rejected.</p>
        <p>Please contact our support team for more details or to resubmit your documents.</p>
        <p>Thank you for your understanding.</p>
      `;

  try {
    await transporter.sendMail({
      from: `"Mereb-Gebeya" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to} for status ${status}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

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
        console.log("User found:", userFound[0]);
        if (
          userFound[0].role !== "ADMIN" &&
          userFound[0].businessStatus !== "ACTIVE"
        ) {
          return c.json(
            {
              error: "Unauthorized",
              message: "Your account is not active. Please contact support.",
            },
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
        return c.json({ email, password, role: userFound[0].role });
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
          role: "USER",
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
  })
  .patch(
    "/:userId",
    zValidator("json", updateUserSchema),
    sessionMiddleware,
    async (c) => {
      const userId = c.req.param("userId");
      if (!userId) {
        return c.json(
          { error: "BadRequest", message: "User ID is required" },
          400
        );
      }
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
        aboutus,
        mission,
      } = c.req.valid("json");
      console.log("Updating user with ID:", userId);
      console.log("password:", password);
      if (
        !name ||
        !email ||
        !phoneNumber ||
        !businessIndustry ||
        !businessLocation ||
        !businessEmail ||
        !businessPhone ||
        !businessLicense ||
        !authorizationLetter ||
        !businessAddress
      ) {
        return c.json(
          { error: "BadRequest", message: "All fields are required" },
          400
        );
      }
      try {
        const userFound = await db
          .select()
          .from(user)
          .where(eq(user.id, userId));
        if (userFound.length === 0) {
          return c.json({ error: "NotFound", message: "User not found" }, 404);
        }
        const updatedUser = await db
          .update(user)
          .set({
            name,
            email,
            phoneNumber,
            image,
            businessIndustry,
            businessLocation,
            businessEmail,
            businessPhone,
            businessAddress,
            businessBio: businessBio || "",
            businessWebsite: businessWebsite || "",
            businessLicense,
            authorizationLetter,
            aboutus: aboutus || "",
            mission: mission || "",
          })
          .where(eq(user.id, userId))
          .returning();
        return c.json({ data: updatedUser[0] });
      } catch (error) {
        console.log("Error while updating user", error);
        return c.json(
          { error: "InternalServerError", message: "Internal Server Error" },
          500
        );
      }
    }
  )
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
  .get("/", async (c) => {
    try {
      const users = await db.select().from(user);
      if (users.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: users });
    } catch (error) {
      console.log("Error while getting all users", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .patch("/:userId/verify", sessionMiddleware, async (c) => {
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
        return c.json({ error: "NotFound", message: "User not found" }, 404);
      }
      // Check if the requester is an admin
      const adminId = c.get("userId") as string;
      const admin = await db.select().from(user).where(eq(user.id, adminId));
      if (admin.length === 0 || admin[0].role !== "ADMIN") {
        return c.json(
          { error: "Forbidden", message: "Admin access required" },
          403
        );
      }
      const updatedUser = await db
        .update(user)
        .set({ businessStatus: "ACTIVE" })
        .where(eq(user.id, userId))
        .returning();
      await sendEmailNotification(
        userFound[0].email,
        "ACTIVE",
        userFound[0].name || "User"
      );
      return c.json({ data: updatedUser[0] });
    } catch (error) {
      console.error("Error while verifying user", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .patch("/:userId/reject", sessionMiddleware, async (c) => {
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
        return c.json({ error: "NotFound", message: "User not found" }, 404);
      }
      // Check if the requester is an admin
      const adminId = c.get("userId") as string;
      const admin = await db.select().from(user).where(eq(user.id, adminId));
      if (admin.length === 0 || admin[0].role !== "ADMIN") {
        return c.json(
          { error: "Forbidden", message: "Admin access required" },
          403
        );
      }
      const updatedUser = await db
        .update(user)
        .set({ businessStatus: "REJECTED" })
        .where(eq(user.id, userId))
        .returning();
      await sendEmailNotification(
        userFound[0].email,
        "REJECTED",
        userFound[0].name || "User"
      );
      return c.json({ data: updatedUser[0] });
    } catch (error) {
      console.error("Error while rejecting user", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Internal Server Error",
        },
        500
      );
    }
  })
  .get("/loggedin", sessionMiddleware, async (c) => {
    try {
      const userId = c.get("userId") as string;
      if (!userId) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const userFound = await db.select().from(user).where(eq(user.id, userId));
      if (userFound.length === 0) {
        return c.json({ data: null }, 404);
      }
      return c.json({ data: userFound[0] });
    } catch (error) {
      console.error("Error while getting logged in user", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  });

export default app;
