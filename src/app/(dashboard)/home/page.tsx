import FilterOptions from "@/features/home/components/filter-options";
import ItemLists from "@/features/home/components/item-list";

export default function HomePage() {
  return (
    <div className="h-full flex flex-col py-4 gap-y-6">
      <FilterOptions />
      <ItemLists />
    </div>
  );
}
