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
import { Button } from "../ui/button";

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
  id?: string;
  key?: string | number;
}

export default function CustomMultipleImageUploader({
  fieldTitle,
  nameInSchema,
  placeHolder = "Upload images",
  className,
  maxFiles = 100,
  listing,
  editMode = false,
  clearImages,
}: CustomMultipleImageUploaderProps) {
  const form = useFormContext();
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Initialize previews and form value only once when props change
  useEffect(() => {
    if (editMode && listing?.otherImages) {
      const initialPreviews: ImagePreview[] = listing.otherImages.map(
        (img, index) => ({
          url: img,
          isExisting: true,
          id: img,
          key: `existing-${index}`,
        })
      );
      setPreviews(initialPreviews);
      form.setValue(nameInSchema, listing.otherImages || []);
    } else {
      setPreviews([]);
      form.setValue(nameInSchema, []);
    }
  }, [editMode, listing, nameInSchema, form]);

  // Cleanup new upload previews
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (!preview.isExisting && preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (images: string[]) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImages = (form.getValues(nameInSchema) as string[]) || [];
    const totalImages = previews.length + files.length;

    if (totalImages > maxFiles) {
      form.setError(nameInSchema, {
        type: "manual",
        message: `You can upload a maximum of ${maxFiles} images`,
      });
      return;
    }

    const convertToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    };

    Promise.all(files.map(convertToBase64)).then((base64Images) => {
      const validImages = base64Images.filter((img) => img);
      if (validImages.length === 0) return;

      const newImages = [...currentImages, ...validImages];
      onChange(newImages);

      // Fix: Use prev inside the setPreviews callback
      setPreviews((prev) => {
        const newPreviews = validImages.map((url, index) => ({
          url,
          isExisting: false,
          id: url + Date.now(),
          key: `new-${index}`,
        }));
        console.log(
          "Updated previews length:",
          [...prev, ...newPreviews].length
        ); // Debug log
        return [...prev, ...newPreviews];
      });
    });
  };

  const removeImage = (index: number, onChange: (images: string[]) => void) => {
    const preview = previews[index];
    if (!preview) return;

    setDeletingIndex(index);

    try {
      const currentImages = form.getValues(nameInSchema) as string[];
      const updatedImages = currentImages.filter((_, i: number) => i !== index);
      onChange(updatedImages);

      setPreviews((prev) => {
        const updatedPreviews = prev.filter((_, i: number) => i !== index);
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

  const handleClearImages = () => {
    if (clearImages) {
      clearImages();
    }
    setPreviews([]);
    form.setValue(nameInSchema, []);
    toast.success("All images cleared.");
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
              <div className="flex gap-2">
                <label
                  htmlFor={nameInSchema}
                  className={cn(
                    "flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 px-16",
                    previews.length >= maxFiles &&
                      "opacity-50 cursor-not-allowed"
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
                {editMode && previews.length > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-12 w-32 text-xs"
                    onClick={handleClearImages}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {previews.map((preview, index) => (
                    <div
                      key={preview.key || preview.id || `preview-${index}`}
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
