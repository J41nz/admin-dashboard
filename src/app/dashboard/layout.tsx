import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* ml-64 creates the margin-left to prevent content 
        from being hidden behind the fixed sidebar 
      */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}