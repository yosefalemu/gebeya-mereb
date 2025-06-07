/* eslint-disable @next/next/no-img-element */
"use client";

import { useFormContext } from "react-hook-form";
import { Upload, X, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { SelectResourceSchemaType } from "@/features/listings/schemas";

interface CustomMultipleImageUploaderProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder?: string;
  className?: string;
  maxFiles?: number;
  listing?: SelectResourceSchemaType;
  editMode?: boolean;
  clearImages?: () => void;
}

interface ImagePreview {
  url: string;
  isExisting: boolean;
  file?: File;
  id?: string;
}

export default function CustomMultipleImageUploader({
  fieldTitle,
  nameInSchema,
  placeHolder = "Upload images",
  className,
  maxFiles = 100,
  listing,
  editMode = false,
}: CustomMultipleImageUploaderProps) {
  const form = useFormContext();
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Initialize previews with existing images in edit mode
  useEffect(() => {
    if (editMode && listing?.otherImages) {
      const initialPreviews: ImagePreview[] = listing.otherImages.map(
        (img) => ({
          url: img, // Base64 string from SelectResourceSchemaType
          isExisting: true,
          id: img, // Use image URL as ID for uniqueness
        })
      );
      setPreviews(initialPreviews);
    } else {
      setPreviews([]);
    }

    // Cleanup new upload previews
    return () => {
      previews.forEach((preview) => {
        if (!preview.isExisting && preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [listing, editMode]);

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (files: File[]) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentFiles = form.getValues(nameInSchema) || [];
    const totalImages = previews.length + files.length;

    if (totalImages > maxFiles) {
      form.setError(nameInSchema, {
        type: "manual",
        message: `You can upload a maximum of ${maxFiles} images`,
      });
      return;
    }

    // Validate file types and sizes (aligned with insertResourceSchema)
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/gif"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isValidType) {
        form.setError(nameInSchema, {
          type: "manual",
          message: "Images must be JPEG, PNG, or GIF",
        });
      }
      if (!isValidSize) {
        form.setError(nameInSchema, {
          type: "manual",
          message: "Images must be less than 5MB",
        });
      }
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    // Update form value with new files
    const newFiles = [...currentFiles, ...validFiles];
    onChange(newFiles);

    // Generate previews for new uploads
    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isExisting: false,
      file,
      id: file.name + Date.now(), // Unique ID for new files
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number, onChange: (files: File[]) => void) => {
    const preview = previews[index];
    if (!preview || preview.isExisting) return; // Prevent removing existing images unless in edit mode

    setDeletingIndex(index);

    try {
      const currentFiles = form.getValues(nameInSchema) || [];
      const updatedFiles = currentFiles.filter(
        (file: File) => URL.createObjectURL(file) !== preview.url
      );
      onChange(updatedFiles);

      // Update previews
      setPreviews((prev) => {
        const updatedPreviews = prev.filter((_, i) => i !== index);
        if (!preview.isExisting) {
          URL.revokeObjectURL(preview.url);
        }
        return updatedPreviews;
      });
      form.clearErrors(nameInSchema);
      toast.success("Image removed.");
    } catch (error) {
      toast.error("Failed to remove image");
      if (process.env.NODE_ENV === "development") {
        console.error("Error removing image:", error);
      } else {
        console.log("Something went wrong while removing image");
      }
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col gap-y-2", className)}>
          <FormLabel className="text-SM capitalize">{fieldTitle}</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-y-4">
              <label
                htmlFor={nameInSchema}
                className={cn(
                  "flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 px-16",
                  previews.length >= maxFiles && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-x-2 text-gray-500">
                  <Upload className="h-5 w-5" />
                  <span>{placeHolder}</span>
                </div>
                <input
                  id={nameInSchema}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageChange(e, field.onChange)}
                  disabled={previews.length >= maxFiles}
                />
              </label>
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {previews.map((preview, index) => (
                    <div
                      key={preview.id || `preview-${index}`}
                      className="relative"
                    >
                      <img
                        src={preview.url}
                        alt={preview.isExisting ? "Existing image" : "Preview"}
                        className="h-20 w-full object-cover rounded-md"
                        width={80}
                        height={80}
                        onError={(e) => {
                          e.currentTarget.src = "/fallback-image.jpg";
                        }}
                      />
                      {!preview.isExisting && (
                        <button
                          type="button"
                          onClick={() => removeImage(index, field.onChange)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                          disabled={deletingIndex === index}
                        >
                          {deletingIndex === index ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
