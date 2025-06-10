CREATE TYPE "public"."bookingStatus" AS ENUM('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('ETB', 'USD', 'EUR');--> statement-breakpoint
CREATE TYPE "public"."preferredContactMethod" AS ENUM('EMAIL', 'PHONE', 'WHATSAPP', 'SMS', 'IN_PERSON');--> statement-breakpoint
CREATE TYPE "public"."rate" AS ENUM('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY');--> statement-breakpoint
CREATE TYPE "public"."resourceAvailability" AS ENUM('PENDING', 'SOLD', 'RESERVED', 'UNAVAILABLE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."resourceCategory" AS ENUM('TECHNOLOGY', 'BUSINESS', 'EDUCATION', 'HEALTH', 'FINANCE', 'LIFESTYLE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."resourceLocation" AS ENUM('ADDIS_ABABA', 'DIRE_DAW', 'HOSANA', 'BAHIR_DAR', 'GONDAR', 'DESSIE', 'JIMMA', 'ARBA_MINCH', 'MEKELLE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."userStatus" AS ENUM('PENDING', 'ACTIVE', 'REJECTED');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"status" "bookingStatus" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rating" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"rating" varchar(5) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail_image" text NOT NULL,
	"other_images" text[] NOT NULL,
	"category" "resourceCategory" NOT NULL,
	"price" text NOT NULL,
	"currency" "currency" NOT NULL,
	"rate" "rate" NOT NULL,
	"availability" "resourceAvailability" NOT NULL,
	"negoitable" boolean DEFAULT false,
	"location" "resourceLocation" NOT NULL,
	"address" text NOT NULL,
	"user_id" uuid NOT NULL,
	"preferred_contact_method" "preferredContactMethod" NOT NULL,
	"terms_and_conditions" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar NOT NULL,
	"image" text DEFAULT '',
	"role" "userRole" DEFAULT 'USER' NOT NULL,
	"password" varchar NOT NULL,
	"confirm_password" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"business_status" "userStatus" DEFAULT 'PENDING' NOT NULL,
	"business_location" varchar NOT NULL,
	"business_address" varchar NOT NULL,
	"business_industry" varchar NOT NULL,
	"business_email" varchar NOT NULL,
	"business_phone" varchar NOT NULL,
	"business_bio" text DEFAULT '' NOT NULL,
	"business_website" text DEFAULT '' NOT NULL,
	"business_license" text DEFAULT '',
	"authorization_letter" text DEFAULT '',
	"aboutus" text DEFAULT '',
	"mission" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;