import { createInsertSchema } from "drizzle-zod";
import { user } from "@/db/schema";
import { z } from "zod";

const base64Regex = /^data:image\/(jpeg|png|gif);base64,[A-Za-z0-9+/=]+$/;

export const insertUserSchema = createInsertSchema(user, {
  id: (schema) => schema.uuid("Invalid uuid format").optional(),
  name: (schema) =>
    schema
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters"),
  email: (schema) =>
    schema.nonempty("Email is required").email("Invalid email format"),
  phoneNumber: (schema) =>
    schema
      .nonempty("Phone number is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: (schema) =>
    schema
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
  confirmPassword: (schema) => schema.nonempty("Confirm password is required"),
  image: () =>
    z
      .string()
      .refine((val) => base64Regex.test(val), {
        message: "Company mage must be a valid Base64 string",
      })
      .refine((val) => val.length > 0, "Company image is required"),
  businessIndustry: (schema) =>
    schema.nonempty("Business industry is required"),
  businessLocation: (schema) =>
    schema.nonempty("Business location is required"),
  businessAddress: (schema) => schema.nonempty("Business address is required"),
  businessEmail: (schema) =>
    schema
      .nonempty("Business email is required")
      .email("Invalid business email format"),
  businessPhone: (schema) =>
    schema
      .nonempty("Business phone number is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  businessBio: (schema) => schema.optional().default(""),
  businessWebsite: (schema) => schema.optional().default(""),
  businessLicense: () =>
    z
      .string()
      .refine((val) => base64Regex.test(val), {
        message: "Business License must be a valid Base64 string",
      })
      .refine((val) => val.length > 0, "Company image is required"),
  authorizationLetter: () =>
    z
      .string()
      .refine((val) => base64Regex.test(val), {
        message: "Authorization Letter must be a valid Base64 string",
      })
      .refine((val) => val.length > 0, "Company image is required"),
});

export type insertUserSchemaType = typeof insertUserSchema._type;
