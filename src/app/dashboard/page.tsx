export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      <p className="text-gray-500 mt-2">Welcome back to the admin panel.</p>
      
      {/* We will add charts here in the next phase */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
          Chart Placeholder 1
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
          Chart Placeholder 2
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
          Stats Placeholder
        </div>
      </div>
    </div>
  );
}