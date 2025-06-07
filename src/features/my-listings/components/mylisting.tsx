import FilterOptions from "./filter-options";
import MyListingsItems from "./my-listings-items";

export default function MyListings() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">My Listings</h1>
      <div className="flex flex-col gap-4">
        <FilterOptions />
        <MyListingsItems />
      </div>
    </div>
  );
}
