import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { insertResourceSchema } from "../schemas";
import { resources } from "@/db/schema";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("form", insertResourceSchema),
  async (c) => {
    const {
      name,
      category,
      description,
      availability,
      price,
      currency,
      rate,
      location,
      address,
      preferredContactMethod,
      thumbnailImage,
      otherImages,
      negoitable,
      termsAndConditions,
    } = c.req.valid("form");
    const userId = c.get("userId") as string;
    console.log("User ID:", userId);
    if (!userId) {
      return c.json(
        { error: "Unauthorized", message: "User not authenticated" },
        401
      );
    }
    if (
      !name ||
      !description ||
      !thumbnailImage ||
      !category ||
      !price ||
      !currency ||
      !rate ||
      !availability ||
      !location ||
      !address ||
      !preferredContactMethod ||
      !negoitable ||
      otherImages.length === 0 ||
      !termsAndConditions
    ) {
      return c.json(
        { error: "InvalidInput", message: "Required fields are missing" },
        400
      );
    }
    let thumbnailBase64: string;
    try {
      const buffer = Buffer.from(await thumbnailImage.arrayBuffer());
      thumbnailBase64 = `data:${thumbnailImage.type};base64,${buffer.toString(
        "base64"
      )}`;
    } catch (err) {
      console.error("Error processing thumbnail image:", err);
      return c.json(
        {
          error: "InvalidThumbnailImage",
          message: "Failed to process thumbnail image",
        },
        400
      );
    }
    let otherImagesBase64: string[] = [];
    if (otherImages && otherImages.length > 0) {
      try {
        otherImagesBase64 = await Promise.all(
          otherImages.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return `data:${file.type};base64,${buffer.toString("base64")}`;
          })
        );
      } catch (err) {
        console.error("Error processing other images:", err);
        return c.json(
          {
            error: "InvalidOtherImages",
            message: "Failed to process other images",
          },
          400
        );
      }
    }

    try {
      const [newResource] = await db
        .insert(resources)
        .values({
          name,
          description,
          thumbnailImage: thumbnailBase64,
          otherImages: otherImagesBase64,
          category,
          price,
          currency,
          rate,
          availability,
          negoitable,
          location,
          address,
          userId,
          preferredContactMethod,
          termsAndConditions,
        })
        .returning();

      if (!newResource) {
        return c.json(
          {
            error: "FailedToCreateResource",
            message: "Failed to create resource",
          },
          500
        );
      }
      return c.json({ data: newResource }, 201);
    } catch (error) {
      console.log("Error while creating project", error);
      return c.json(
        {
          error: "FailedToCreateProject",
          message: "Failed to create project",
        },
        500
      );
    }
  }
);

export default app;
