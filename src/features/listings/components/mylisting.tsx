"use client";
import FilterOptions from "./filter-options";
import MyListingsItems from "./my-listings-items";
import { useGetUserListings } from "@/features/listings/api/get-user-listings";
import { useState } from "react";

export default function MyListings() {
  const { data, isLoading, isError } = useGetUserListings();
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priceRange: "",
    availability: "",
  });

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // Filter the data based on selected filters
  const filteredData = data
    ? data.filter((listing) => {
        const matchesCategory =
          !filters.category || listing.category === filters.category;
        const matchesLocation =
          !filters.location || listing.location === filters.location;
        const matchesAvailability =
          !filters.availability ||
          listing.availability === filters.availability;

        // Parse price for range filtering
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
          matchesCategory &&
          matchesLocation &&
          matchesAvailability &&
          matchesPriceRange
        );
      })
    : [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">My Listings</h1>
      <div className="flex flex-col gap-4">
        <FilterOptions
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
        <MyListingsItems
          isLoading={isLoading}
          isError={isError}
          data={filteredData}
        />
      </div>
    </div>
  );
}
