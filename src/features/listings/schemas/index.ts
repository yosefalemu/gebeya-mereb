import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { resources } from "@/db/schema";
import { z } from "zod";

const base64Regex = /^data:image\/(jpeg|png|gif);base64,[A-Za-z0-9+/=]+$/;

export const insertResourceSchema = createInsertSchema(resources, {
  id: (schema) => schema.uuid("Invalid UUID format").optional(),
  name: (schema) =>
    schema
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be at most 100 characters"),
  description: (schema) => schema.nonempty("Description is required"),
  thumbnailImage: () =>
    z
      .string()
      .refine((val) => val.length > 0, "Thumbnail image is required")
      .refine((val) => base64Regex.test(val), {
        message: "Thumbnail image must be a valid Base64 string",
      }),
  otherImages: () =>
    z
      .array(
        z.string().refine((val) => !val || base64Regex.test(val), {
          message: "Each image must be a valid Base64 string",
        })
      )
      .refine((arr) => arr.length > 0, {
        message: "At least one additional image is required",
      })
      .refine((arr) => arr.every((val) => val), {
        message: "All images must be valid",
      }),
  category: () =>
    z.enum(
      [
        "TECHNOLOGY",
        "BUSINESS",
        "EDUCATION",
        "HEALTH",
        "FINANCE",
        "LIFESTYLE",
        "OTHER",
      ],
      { errorMap: () => ({ message: "Invalid category" }) }
    ),
  price: (schema) =>
    schema
      .nonempty("Price is required")
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Price must be a valid number (e.g., 100 or 100.00)"
      ),
  currency: () =>
    z.enum(["ETB", "USD", "EUR"], {
      errorMap: () => ({ message: "Invalid currency" }),
    }),
  rate: () =>
    z.enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY"], {
      errorMap: () => ({ message: "Invalid rate" }),
    }),
  availability: () =>
    z.enum(["PENDING", "SOLD", "RESERVED", "UNAVAILABLE", "ARCHIVED"], {
      errorMap: () => ({ message: "Invalid availability" }),
    }),
  negoitable: (schema) => schema.nullable().default(false),
  location: () =>
    z.enum(
      [
        "ADDIS_ABABA",
        "DIRE_DAW",
        "HOSANA",
        "BAHIR_DAR",
        "GONDAR",
        "DESSIE",
        "JIMMA",
        "ARBA_MINCH",
        "MEKELLE",
        "OTHER",
      ],
      { errorMap: () => ({ message: "Invalid location" }) }
    ),
  address: (schema) => schema.nonempty("Address is required"),
  userId: (schema) => schema.optional(),
  preferredContactMethod: () =>
    z.enum(["EMAIL", "PHONE", "WHATSAPP", "SMS", "IN_PERSON"], {
      errorMap: () => ({ message: "Invalid contact method" }),
    }),

  termsAndConditions: (schema) => schema.nullable().default(false),
  createdAt: (schema) => schema.optional(),
  updatedAt: (schema) => schema.optional(),
});

export const selectResourceSchema = createSelectSchema(resources, {
  id: (schema) => schema.uuid("Invalid UUID format").optional(),
  name: (schema) =>
    schema
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be at most 100 characters"),
  description: (schema) => schema.min(1, "Description is required"),
  thumbnailImage: (schema) =>
    schema.refine(
      (val) => base64Regex.test(val),
      "Thumbnail image must be a valid Base64 string"
    ),
  otherImages: (schema) =>
    schema.refine(
      (arr) => arr.every((val) => base64Regex.test(val)),
      "Each image in otherImages must be a valid Base64 string"
    ),
  category: () =>
    z.enum(
      [
        "TECHNOLOGY",
        "BUSINESS",
        "EDUCATION",
        "HEALTH",
        "FINANCE",
        "LIFESTYLE",
        "OTHER",
      ],
      { errorMap: () => ({ message: "Invalid category" }) }
    ),
  price: (schema) =>
    schema.regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid number (e.g., 100 or 100.00)"
    ),
  currency: () =>
    z.enum(["ETB", "USD", "EUR"], {
      errorMap: () => ({ message: "Invalid currency" }),
    }),
  rate: () =>
    z.enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY"], {
      errorMap: () => ({ message: "Invalid rate" }),
    }),
  availability: () =>
    z.enum(["PENDING", "SOLD", "RESERVED", "UNAVAILABLE", "ARCHIVED"], {
      errorMap: () => ({ message: "Invalid availability" }),
    }),
  negoitable: (schema) => schema.default(false),
  location: () =>
    z.enum(
      [
        "ADDIS_ABABA",
        "DIRE_DAW",
        "HOSANA",
        "BAHIR_DAR",
        "GONDAR",
        "DESSIE",
        "JIMMA",
        "ARBA_MINCH",
        "MEKELLE",
        "OTHER",
      ],
      { errorMap: () => ({ message: "Invalid location" }) }
    ),
  address: (schema) => schema.min(1, "Address is required"),
  userId: (schema) => schema.uuid("Invalid user UUID"),
  termsAndConditions: (schema) => schema.default(false),
  preferredContactMethod: () =>
    z.enum(["EMAIL", "PHONE", "WHATSAPP", "SMS", "IN_PERSON"], {
      errorMap: () => ({ message: "Invalid contact method" }),
    }),
  createdAt: () => z.string().optional(),
  updatedAt: () => z.string().optional(),
});

export type InsertResourceSchemaType = z.infer<typeof insertResourceSchema>;
export type SelectResourceSchemaType = z.infer<typeof selectResourceSchema>;
