import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import MemberAvatar from "../member-avatar";

interface CustomSelectInputProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
  data?: { id: string; name: string; displayName?: string; image?: string }[];
  isFetchingData?: boolean;
}

export default function CustomSelectInput({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  data,
  isFetchingData,
}: CustomSelectInputProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        return (
          <FormItem className={cn("w-full", className)}>
            <FormLabel>{fieldTitle}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "w-full max-w-xl disabled:cursor-not-allowed h-12 py-6",
                    className
                  )}
                >
                  <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="flex">
                {isFetchingData ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-8 w-full flex items-center gap-x-8 pl-4 pr-2"
                      >
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 flex-1" />
                      </Skeleton>
                    ))}
                  </div>
                ) : (
                  data?.map((item) => (
                    <SelectItem value={item.name} key={item.id}>
                      <div className="flex items-center gap-x-2">
                        <MemberAvatar
                          image={item.image}
                          name={item.displayName || item.name}
                          className="size-6 text-xs"
                        />
                        {item.displayName || item.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}