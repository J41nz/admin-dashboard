"use client";

import { createProduct, updateProduct } from "@/lib/actions";
import { useState } from "react";
import { Upload, X, Save } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialData?: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    image?: string;
  };
}

export default function ProductFrom({ initialData }: ProductFormProps) {
  const [preview, setPreview] = useState(initialData?.image || "");
  const isEditMode = !!initialData;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const action = isEditMode ? updateProduct : createProduct;

  return (
    <form action={action} className="bg-white p-8 rounded-xl shadow border border-slate-200 max-w-2xl mx-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </Link>
      </div>

      {/* Hidden Fields */}
      {isEditMode && <input type="hidden" name="id" value={initialData._id} />}
      <input type="hidden" name="image" value={preview} />

      <div className="space-y-6">
        
        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
          <div className="relative border-2 border-dashed border-slate-300 rounded-lg h-48 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImage} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            {preview ? (
              <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-500">
                <Upload className="mx-auto mb-2 text-blue-500" size={32} />
                <p className="font-medium">Click to upload image</p>
              </div>
            )}
            {preview && (
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-0">
                 <p className="text-white font-medium">Click to change image</p>
               </div>
            )}
          </div>
        </div>

        {/* INPUTS - Force Black Text with Inline Style */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
          <input 
            name="name" 
            defaultValue={initialData?.name}
            type="text" 
            style={{ color: "black", backgroundColor: "white" }} // FORCE BLACK TEXT
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Smart Watch"
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
            <input 
              name="price" 
              defaultValue={initialData?.price}
              type="number" 
              step="0.01" 
              style={{ color: "black", backgroundColor: "white" }} // FORCE BLACK TEXT
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
            <input 
              name="stock" 
              defaultValue={initialData?.stock}
              type="number" 
              style={{ color: "black", backgroundColor: "white" }} // FORCE BLACK TEXT
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
              required 
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
          <Save size={20} />
          <span>{isEditMode ? "Update Product" : "Save Product"}</span>
        </button>

      </div>
    </form>
  );
}