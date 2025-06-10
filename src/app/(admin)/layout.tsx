import AdminSidebar from "@/components/admin-sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between h-full min-h-scree">
      <div className="h-full w-full px-0">
        <div className="flex w-full h-full gap-x-2 relative">
          <AdminSidebar />
          <div className="w-full flex flex-col min-h-screen pl-72">
            <div className="max-w-screen-2xl flex-1">
              <main className="h-full px-6 flex-col min-h-full">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
