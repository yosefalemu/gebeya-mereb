import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bookings, resources, user } from "@/db/schema";
import { eq, and, not, inArray } from "drizzle-orm";

import { z } from "zod";

const createBookingSchema = z.object({
  listingId: z.string(),
});

const app = new Hono()
  .post(
    "/create",
    zValidator("json", createBookingSchema),
    sessionMiddleware,
    async (c) => {
      const userId = c.get("userId") as string;
      const { listingId } = c.req.valid("json");
      try {
        // check the listing has occured
        const listingExists = await db
          .select()
          .from(resources)
          .where(eq(resources.id, listingId));
        if (listingExists.length === 0) {
          return c.json(
            { error: "ListingNotFound", message: "Listing not found" },
            404
          );
        }
        // check if not booked before
        const bookingExists = await db
          .select()
          .from(bookings)
          .where(
            and(
              eq(bookings.resourceId, listingId),
              not(eq(bookings.status, "CANCELED"))
            )
          );
        if (bookingExists.length > 0) {
          return c.json(
            {
              error: "BookingAlreadyExists",
              message: "Booking already exists",
            },
            400
          );
        }
        //update the resourwce to booked
        const updatedResource = await db
          .update(resources)
          .set({ availability: "RESERVED" })
          .where(eq(resources.id, listingId));
        if (
          !updatedResource ||
          (typeof updatedResource.rowCount === "number" &&
            updatedResource.rowCount === 0)
        ) {
          return c.json(
            {
              error: "ResourceUpdateFailed",
              message: "Resource update failed",
            },
            500
          );
        }
        // create the booking
        const newBooking = await db.insert(bookings).values({
          receiverId: listingExists[0].userId,
          senderId: userId,
          resourceId: listingId,
          status: "PENDING",
        });
        console.log("New booking created", newBooking);
        return c.json({ data: newBooking }, 200);
      } catch (error) {
        console.log("Error while creating booking", error);
        return c.json(
          { error: "InternalServerError", message: "Internal Server Error" },
          500
        );
      }
    }
  )
  .get("/sendBookinRequests", sessionMiddleware, async (c) => {
    const userId = c.get("userId") as string;
    try {
      const bookingsList = await db
        .select()
        .from(bookings)
        .where(eq(bookings.senderId, userId));
      const resourcesId = bookingsList.map((booking) => booking.resourceId);
      const resourcesList = await db
        .select()
        .from(resources)
        .where(inArray(resources.id, resourcesId));
      return c.json({ data: resourcesList }, 200);
    } catch (error) {
      console.log("Error while getting booking requests", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .get("/receiveBookingRequests", sessionMiddleware, async (c) => {
    const userId = c.get("userId") as string;
    try {
      const bookingsList = await db
        .select()
        .from(bookings)
        .where(eq(bookings.receiverId, userId));
      const resourcesId = bookingsList.map((booking) => booking.resourceId);
      const senderId = bookingsList[0]?.senderId;
      const senderUser = await db
        .select()
        .from(user)
        .where(eq(user.id, senderId));
      console.log("Sender User:", senderUser);
      const resourcesList = await db
        .select()
        .from(resources)
        .where(inArray(resources.id, resourcesId));
      const dataWithSender = resourcesList.map((resource) => ({
        ...resource,
        sender: senderUser[0] || null,
      }));
      return c.json({ data: dataWithSender }, 200);
    } catch (error) {
      console.log("Error while getting booking requests", error);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  });

export default app;
