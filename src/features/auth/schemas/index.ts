import { createInsertSchema } from "drizzle-zod";
import { user } from "@/db/schema";
import { z } from "zod";

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
  image: (schema) =>
    schema
      .optional()
      .transform((value) => (value === "" || value == null ? undefined : value))
      .or(
        z
          .instanceof(File)
          .refine((file) => file.size > 0, "File cannot be empty")
          .optional()
      ),
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
      .instanceof(File)
      .refine((file) => file.size > 0, "Business license file is required"),
  authorizationLetter: () =>
    z
      .instanceof(File)
      .refine((file) => file.size > 0, "Authorization letter file is required"),
});

export type insertUserSchemaType = typeof insertUserSchema._type;
