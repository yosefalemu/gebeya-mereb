import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { insertResourceSchema } from "../schemas";
import { resources } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", insertResourceSchema),
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
      } = c.req.valid("json");
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

      try {
        const [newResource] = await db
          .insert(resources)
          .values({
            name,
            description,
            thumbnailImage,
            otherImages,
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
  )
  .get("/get-user-listings", sessionMiddleware, async (c) => {
    const userId = c.get("userId") as string;
    if (!userId) {
      return c.json(
        { error: "Unauthorized", message: "User not authenticated" },
        401
      );
    }
    try {
      const listings = await db
        .select()
        .from(resources)
        .where(eq(resources.userId, userId));

      if (listings.length === 0) {
        return c.json({ data: [] }, 200);
      }

      return c.json({ data: listings }, 200);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      return c.json(
        {
          error: "FailedToFetchListings",
          message: "Failed to fetch user listings",
        },
        500
      );
    }
  })
  .get("/:listingId", sessionMiddleware, async (c) => {
    const listingId = c.req.param("listingId");
    if (!listingId) {
      return c.json(
        { error: "InvalidInput", message: "Listing ID is required" },
        400
      );
    }
    try {
      const listing = await db
        .select()
        .from(resources)
        .where(eq(resources.id, listingId))
        .limit(1);

      if (listing.length === 0) {
        return c.json({ error: "NotFound", message: "Listing not found" }, 404);
      }
      const listtingCategory = listing[0].category;
      if (!listtingCategory) {
        return c.json(
          { error: "InvalidListing", message: "Listing category is missing" },
          400
        );
      }
      const relatedListings = await db
        .select()
        .from(resources)
        .where(eq(resources.category, listtingCategory));
      if (relatedListings.length === 0) {
        return c.json({ data: listing[0], relatedListings: [] }, 200);
      }

      // Exclude the current listing from related listings
      const filteredRelatedListings = relatedListings.filter(
        (item) => item.id !== listing[0].id
      );
      if (filteredRelatedListings.length === 0) {
        return c.json({ data: listing[0], relatedListings: [] }, 200);
      }
      const limitedRelatedListings = filteredRelatedListings.slice(0, 4);
      console.log("Related Listings:", limitedRelatedListings);
      return c.json(
        { data: listing[0], relatedListings: limitedRelatedListings },
        200
      );
    } catch (error) {
      console.error("Error fetching listing:", error);
      return c.json(
        {
          error: "FailedToFetchListing",
          message: "Failed to fetch listing",
        },
        500
      );
    }
  })
  .patch(
    "/:listingId",
    zValidator("json", insertResourceSchema),
    sessionMiddleware,
    async (c) => {
      const listingId = c.req.param("listingId");
      if (!listingId) {
        return c.json(
          { error: "InvalidInput", message: "Listing ID is required" },
          400
        );
      }
      const userId = c.get("userId") as string;
      if (!userId) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
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
      } = c.req.valid("json");
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
        !otherImages ||
        !termsAndConditions
      ) {
        return c.json(
          { error: "InvalidInput", message: "Required fields are missing" },
          400
        );
      }
      try {
        const [updatedResource] = await db
          .update(resources)
          .set({
            name,
            description,
            thumbnailImage,
            otherImages,
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
          .where(eq(resources.id, listingId))
          .returning();

        if (!updatedResource) {
          return c.json(
            { error: "NotFound", message: "Listing not found" },
            404
          );
        }
        return c.json({ data: updatedResource }, 200);
      } catch (error) {
        console.error("Error updating listing:", error);
        return c.json(
          {
            error: "FailedToUpdateListing",
            message: "Failed to update listing",
          },
          500
        );
      }
    }
  )
  .delete("/:listingId", sessionMiddleware, async (c) => {
    const listingId = c.req.param("listingId");
    if (!listingId) {
      return c.json(
        { error: "InvalidInput", message: "Listing ID is required" },
        400
      );
    }
    const userId = c.get("userId") as string;
    if (!userId) {
      return c.json(
        { error: "Unauthorized", message: "User not authenticated" },
        401
      );
    }
    try {
      const deletedResource = await db
        .delete(resources)
        .where(and(eq(resources.id, listingId), eq(resources.userId, userId)))
        .returning();

      if (deletedResource.length === 0) {
        return c.json({ error: "NotFound", message: "Listing not found" }, 404);
      }
      return c.json({ data: deletedResource[0] }, 200);
    } catch (error) {
      console.error("Error deleting listing:", error);
      return c.json(
        {
          error: "FailedToDeleteListing",
          message: "Failed to delete listing",
        },
        500
      );
    }
  })
  .get("/", async (c) => {
    console.log("Fetching all listings");
    console.log("Request URL:");
    try {
      const listings = await db.select().from(resources);
      if (listings.length === 0) {
        return c.json({ data: [] }, 200);
      }
      return c.json({ data: listings }, 200);
    } catch (error) {
      console.error("Error fetching all listings:", error);
      return c.json(
        { error: "FailedToFetchListings", message: "Failed to fetch listings" },
        500
      );
    }
  });

export default app;
