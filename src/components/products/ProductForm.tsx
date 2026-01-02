"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { MdCloudUpload, MdSave, MdArrowBack } from "react-icons/md";
import Link from "next/link";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  // NEW: Add sales field validation
  sales: z.coerce.number().int().min(0, "Sales cannot be negative").default(0),
  category: z.string().min(1, "Category is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  initialData?: any; 
  isEditMode?: boolean;
}

export default function ProductForm({ initialData, isEditMode = false }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price,
      stock: initialData.stock,
      // NEW: Load existing sales data
      sales: initialData.sales || 0,
      category: initialData.category,
    } : {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      sales: 0,
      category: "",
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      setUploading(true);
      
      if (isEditMode) {
        await axios.put(`/api/products/${initialData._id}`, data);
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("stock", data.stock.toString());
        // NEW: Send sales data
        formData.append("sales", data.sales.toString());
        formData.append("category", data.category);

        if (selectedImage) {
          formData.append("image", selectedImage);
        }

        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditMode ? "Edit Product" : "Create New Product"}
        </h2>
        <Link href="/dashboard/products" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
            <MdArrowBack /> Back to List
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
                {...register("name")}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
                {...register("description")}
                rows={3}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
        </div>

        {/* Pricing, Stock, AND SALES */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              {...register("stock")}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sold Units</label>
            <input
              type="number"
              {...register("sales")}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50"
              placeholder="0"
            />
            <p className="text-xs text-gray-400 mt-1">Updates Revenue</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register("category")}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
          </select>
        </div>

        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                <div className="space-y-1 text-center">
                    <MdCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                                type="file" 
                                className="sr-only" 
                                accept="image/*"
                                onChange={(e) => {
                                    if(e.target.files?.[0]) setSelectedImage(e.target.files[0]);
                                }}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500">{selectedImage ? selectedImage.name : "PNG, JPG, GIF up to 5MB"}</p>
                </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          <MdSave className="mr-2" />
          {uploading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}