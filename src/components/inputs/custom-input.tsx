import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface CustomInputLabelProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
  maxCharLength?: number;
  showTilte?: boolean;
}
export default function CustomInputLabel({
  fieldTitle,
  nameInSchema,
  showTilte = true,
  placeHolder,
  className,
  maxCharLength,
  ...props
}: CustomInputLabelProps) {
  const form = useFormContext();
  return (
    // In CustomInputLabel
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        console.log(`${nameInSchema} field value:`, field.value); // Debug log
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (
            maxCharLength === undefined ||
            e.target.value.length <= maxCharLength
          ) {
            field.onChange(e);
          }
        };
        return (
          <FormItem className={cn("", className)}>
            {showTilte && (
              <FormLabel className="text-sm font-medium">
                {fieldTitle}
              </FormLabel>
            )}
            <FormControl>
              <Input
                id={nameInSchema}
                className={cn(
                  "w-full max-w-xl disabled:cursor-not-allowed h-12",
                  className
                )}
                placeholder={placeHolder}
                {...props}
                {...field}
                onChange={handleChange}
                autoComplete="off"
              />
            </FormControl>
            {maxCharLength !== undefined && (
              <p className="text-xs text-neutral-500 max-w-xl text-right">
                {field.value?.length ?? 0}/{maxCharLength}
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
