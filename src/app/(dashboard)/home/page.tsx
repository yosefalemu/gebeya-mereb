"use client";
import FilterOptions from "@/features/home/components/filter-options";
import ItemLists from "@/features/home/components/item-list";
import { useGetAllListings } from "@/features/listings/api/all-listings";
import { useState } from "react";

interface Listing {
  id: string;
  name: string;
  description: string;
  thumbnailImage: string;
  otherImages: string[];
  category: "TECHNOLOGY" | "BUSINESS" | "EDUCATION" | "HEALTH" | "FINANCE" | "LIFESTYLE" | "OTHER";
  location: string;
  price: string;
  availability: "PENDING" | "SOLD" | "RESERVED" | "UNAVAILABLE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  // Add other fields if needed based on your data
}

export default function HomePage() {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priceRange: "",
    availability: "",
    search: "",
  });
  const { data, isLoading, isError } = useGetAllListings();

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // Filter the data based on selected filters
  const filteredData = data
    ? data.data.filter((listing: Listing) => {
        // Search by name (case-insensitive)
        const matchesSearch =
          !filters.search ||
          listing.name.toLowerCase().includes(filters.search.toLowerCase());

        // Category filter
        const matchesCategory =
          !filters.category || listing.category === filters.category;

        // Location filter
        const matchesLocation =
          !filters.location || listing.location === filters.location;

        // Availability filter
        const matchesAvailability =
          !filters.availability ||
          listing.availability === filters.availability;

        // Price range filter
        const price = parseFloat(listing.price);
        const [minPrice, maxPrice] = filters.priceRange
          .split(" - ")
          .map((val) => (val === "1000000+" ? Infinity : parseFloat(val))) || [
          0,
          Infinity,
        ];
        const matchesPriceRange =
          !filters.priceRange || (price >= minPrice && price <= maxPrice);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesLocation &&
          matchesAvailability &&
          matchesPriceRange
        );
      })
    : [];

  return (
    <div className="h-full flex flex-col py-4 gap-y-6">
      <FilterOptions
        currentFilters={filters}
        onFilterChange={handleFilterChange}
      />
      <ItemLists data={filteredData} isLoading={isLoading} isError={isError} />
    </div>
  );
}
