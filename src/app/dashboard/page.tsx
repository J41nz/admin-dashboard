import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Real-time metrics and product analysis.
        </p>
      </div>

      <DashboardCharts />
    </div>
  );
}