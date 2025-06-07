import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { FormField, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";

interface CustomImageUploaderProps {
  fieldTitle: string;
  nameInSchema: string;
  isPending?: boolean;
  className?: string;
}

export default function CustomImageUploader({
  fieldTitle,
  nameInSchema,
  isPending,
  className,
}: CustomImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useFormContext();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      form.setValue(nameInSchema, file, { shouldValidate: true });
    }
  };

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        return (
          <div className={cn("flex flex-col gap-y-2", className)}>
            <div className="flex items-center gap-x-5">
              {field.value instanceof File ? (
                <div className="size-[72px] rounded-md overflow-hidden relative">
                  <Image
                    src={URL.createObjectURL(field.value)}
                    fill
                    className="object-cover"
                    alt={fieldTitle}
                  />
                </div>
              ) : (
                <Avatar className="size-[72px]">
                  <AvatarFallback>
                    <ImageIcon className="text-[32px] text-neutral-400" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col">
                <p className="text-xl font-semibold">{fieldTitle}</p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, SVG, JPEG, max 1MB
                </p>
                <input
                  type="file"
                  className="hidden"
                  ref={inputRef}
                  disabled={isPending}
                  onChange={handleImageChange}
                  accept=".jpg,.png,.jpeg,.svg"
                />
                {field.value ? (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending}
                    size="sm"
                    className="w-fit mt-2 text-xs cursor-pointer"
                    onClick={() => {
                      field.onChange(undefined);
                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                      form.trigger(nameInSchema);
                    }}
                  >
                    Remove Image
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending}
                    size="sm"
                    className="w-fit mt-2 text-xs cursor-pointer"
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                )}
                <FormMessage className="text-xs" />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
