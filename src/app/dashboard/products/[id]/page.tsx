"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductForm from "@/components/products/ProductForm";
import { use } from "react"; // 1. Import 'use'

// 2. Update type definition: params is now a Promise
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 3. Unwrap the promise to get the actual ID
  const { id } = use(params);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id], // 4. Use the unwrapped 'id' here
    queryFn: async () => {
      const res = await axios.get("/api/products");
      
      // 5. Use the unwrapped 'id' here as well
      const found = res.data.find((p: any) => p._id === id);
      
      if (!found) throw new Error("Product not found");
      return found;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Product not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500">Update product details.</p>
      </div>
      <ProductForm initialData={product} isEditMode={true} />
    </div>
  );
}