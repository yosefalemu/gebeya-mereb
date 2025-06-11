import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoTriangleDown } from "react-icons/go";

interface FilterOptionsProps {
  onFilterChange: (filterType: string, value: string) => void;
  currentFilters: {
    category: string;
    location: string;
    priceRange: string;
    availability: string;
  };
}

export default function FilterOptions({
  onFilterChange,
  currentFilters,
}: FilterOptionsProps) {
  // Map backend availability values to display text
  const availabilityDisplayMap: { [key: string]: string } = {
    PENDING: "ACTIVE",
    SOLD: "SOLD",
    RESERVED: "RESERVED",
    UNAVAILABLE: "UNAVAILABLE",
    ARCHIVED: "ARCHIVED",
    "": "All",
  };

  return (
    <div className="flex items-center justify-between ml-auto gap-x gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-sm cursor-pointer flex items-center justify-center gap-x gap-x-2 w-36 h-6"
            variant={currentFilters.category ? "outline" : "default"}
          >
            <h1 className="text-xs uppercase text-md">
              {currentFilters.category || "Category"}
            </h1>
            <GoTriangleDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuLabel className="uppercase">Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterChange("category", "")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("category", "TECHNOLOGY")}
          >
            TECHNOLOGY
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("category", "BUSINESS")}
          >
            BUSINESS
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("category", "EDUCATION")}
          >
            EDUCATION
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("category", "HEALTH")}
          >
            HEALTH
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("category", "FINANCE")}
          >
            FINANCE
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("category", "LIFESTYLE")}
          >
            LIFESTYLE
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("category", "OTHER")}>
            OTHER
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-sm cursor-pointer flex items-center justify-center gap-x gap-x-2 w-36 h-6"
            variant={currentFilters.location ? "outline" : "default"}
          >
            <h1 className="text-xs uppercase text-md">
              {currentFilters.location || "Location"}
            </h1>
            <GoTriangleDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuLabel className="uppercase">Location</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterChange("location", "")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "ADDIS_ABABA")}
          >
            ADDIS_ABABA
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "DIRE_DAW")}
          >
            DIRE_DAW
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "HOSANA")}
          >
            HOSANA
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "BAHIR_DAR")}
          >
            BAHIR_DAR
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "GONDAR")}
          >
            GONDAR
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "DESSIE")}
          >
            DESSIE
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("location", "JIMMA")}>
            JIMMA
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "ARBA_MINCH")}
          >
            ARBA_MINCH
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("location", "MEKELLE")}
          >
            MEKELLE
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("location", "OTHER")}>
            OTHER
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-sm cursor-pointer flex items-center justify-center gap-x gap-x-2 w-40 h-6"
            variant={currentFilters.priceRange ? "outline" : "default"}
          >
            <h1 className="text-xs uppercase text-md">
              {currentFilters.priceRange || "Price Range"}
            </h1>
            <GoTriangleDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 text-center">
          <DropdownMenuLabel className="uppercase">
            Price Range
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterChange("priceRange", "")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("priceRange", "0 - 10000")}
          >
            0 - 10000
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("priceRange", "10000 - 50000")}
          >
            10000 - 50000
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("priceRange", "50000 - 100000")}
          >
            50000 - 100000
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("priceRange", "100000 - 500000")}
          >
            100000 - 500000
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("priceRange", "500000 - 10000000")}
          >
            500000 - 10000000
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("priceRange", "1000000+")}
          >
            1000000+
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-sm cursor-pointer flex items-center justify-center gap-x gap-x-2 w-36 h-6"
            variant={currentFilters.availability ? "outline" : "default"}
          >
            <h1 className="text-xs uppercase text-md">
              {availabilityDisplayMap[currentFilters.availability] ||
                "Availability "}
            </h1>
            <GoTriangleDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuLabel>AVAILABILITY</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterChange("availability", "")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("availability", "PENDING")}
          >
            ACTIVE
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("availability", "SOLD")}
          >
            SOLD
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("availability", "RESERVED")}
          >
            RESERVED
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("availability", "UNAVAILABLE")}
          >
            UNAVAILABLE
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange("availability", "ARCHIVED")}
          >
            ARCHIVED
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
