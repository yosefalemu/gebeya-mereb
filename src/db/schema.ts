import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("userStatus", [
  "PENDING",
  "ACTIVE",
  "REJECTED",
]);

export const resourceCategoryEnum = pgEnum("resourceCategory", [
  "TECHNOLOGY",
  "BUSINESS",
  "EDUCATION",
  "HEALTH",
  "FINANCE",
  "LIFESTYLE",
  "OTHER",
]);

export const currencyEnum = pgEnum("currency", ["ETB", "USD", "EUR"]);

export const resourceAvailabilityEnum = pgEnum("resourceAvailability", [
  "PENDING",
  "SOLD",
  "RESERVED",
  "UNAVAILABLE",
  "ARCHIVED",
]);

export const resourceLocationEnum = pgEnum("resourceLocation", [
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
]);

export const preferredContactMethodEnum = pgEnum("preferredContactMethod", [
  "EMAIL",
  "PHONE",
  "WHATSAPP",
  "SMS",
  "IN_PERSON",
]);

export const rateEnum = pgEnum("rate", [
  "HOURLY",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email").notNull().unique(),
  image: text("image").default(""),
  password: varchar("password").notNull(),
  confirmPassword: varchar("confirm_password").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  businessStatus: userStatusEnum("business_status")
    .notNull()
    .default("PENDING"),
  businessLocation: varchar("business_location").notNull(),
  businessAddress: varchar("business_address").notNull(),
  businessIndustry: varchar("business_industry").notNull(),
  businessEmail: varchar("business_email").notNull(),
  businessPhone: varchar("business_phone").notNull(),
  businessBio: text("business_bio").notNull().default(""),
  businessWebsite: text("business_website").notNull().default(""),
  businessLicense: text("business_license").default(""),
  authorizationLetter: text("authorization_letter").default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnailImage: text("thumbnail_image").notNull(),
  otherImages: text("other_images").array().notNull(),
  category: resourceCategoryEnum("category").notNull(),
  price: text("price").notNull(),
  currency: currencyEnum("currency").notNull(),
  rate: rateEnum("rate").notNull(),
  availability: resourceAvailabilityEnum("availability").notNull(),
  negoitable: varchar("negoitable").notNull().default("false"),
  location: resourceLocationEnum("location").notNull(),
  address: text("address").notNull(),
  userId: uuid("user_id").notNull(),
  preferredContactMethod: preferredContactMethodEnum(
    "preferred_contact_method"
  ).notNull(),
  termsAndConditions: varchar("terms_and_conditions")
    .notNull()
    .default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rating = pgTable("rating", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  resourceId: uuid("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }),
  rating: varchar("rating", { length: 5 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
