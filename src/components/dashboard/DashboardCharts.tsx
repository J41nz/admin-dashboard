"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import "@/lib/chartSetup"; // Import the registration
import { MdAttachMoney, MdInventory, MdShoppingCart } from "react-icons/md";

// Define the shape of our product data
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  category: string;
}

export default function DashboardCharts() {
  // Fetch data using React Query
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get("/api/products");
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading Dashboard Data...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        No data available. Add products to see charts.
      </div>
    );
  }

  // --- Calculate Metrics ---
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
  const totalSalesVal = products.reduce((acc, curr) => acc + (curr.sales * curr.price), 0); // Estimate revenue

  // --- Prepare Chart 1: Top 5 Bestsellers (Bar Chart) ---
  const sortedBySales = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
  
  const salesData = {
    labels: sortedBySales.map((p) => p.name),
    datasets: [
      {
        label: "Units Sold",
        data: sortedBySales.map((p) => p.sales),
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Blue
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  // --- Prepare Chart 2: Category Distribution (Doughnut) ---
  const categories: Record<string, number> = {};
  products.forEach((p) => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });

  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Products" 
          value={totalProducts} 
          icon={<MdShoppingCart className="w-8 h-8 text-blue-500" />} 
        />
        <StatCard 
          title="Total Stock" 
          value={totalStock} 
          icon={<MdInventory className="w-8 h-8 text-purple-500" />} 
        />
        <StatCard 
          title="Est. Revenue" 
          value={`$${totalSalesVal.toLocaleString()}`} 
          icon={<MdAttachMoney className="w-8 h-8 text-green-500" />} 
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          <Bar 
            data={salesData} 
            options={{ 
              responsive: true, 
              plugins: { legend: { display: false } } 
            }} 
          />
        </div>

        {/* Category Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
          <div className="w-64">
            <Doughnut 
              data={categoryData} 
              options={{ responsive: true }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component for the Cards
function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}