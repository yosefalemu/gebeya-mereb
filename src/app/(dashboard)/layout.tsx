import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between h-full min-h-screen bg-[#001f3e] text-white">
      <div className="h-full w-full px-0">
        <div className="flex w-full h-full gap-x-2 relative">
          <Sidebar />
          <div className="w-full flex flex-col min-h-screen bg-white">
            <Navbar />
            <div className="max-w-screen-2xl flex-1">
              <main className="h-full py-8 px-6 flex-col min-h-full">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
