import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

interface CustomCheckboxInputProps {
  fieldTitle: string;
  nameInSchema: string;
  className?: string;
}

export default function CustomCheckboxInput({
  fieldTitle,
  nameInSchema,
  className,
}: CustomCheckboxInputProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <>
          {" "}
          <FormItem
            className={cn(
              "flex flex-row items-center space-x-3 space-y-0",
              className
            )}
          >
            <div className="space-y-1 leading-none">
              <FormLabel>{fieldTitle}</FormLabel>
            </div>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                }}
                className="h-5 w-5"
              />
            </FormControl>
          </FormItem>
          <FormMessage className="w-full ml-8" />
        </>
      )}
    />
  );
}
