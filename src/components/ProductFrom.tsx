"use client";

import { createProduct } from "@/lib/actions";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function ProductForm() {
  const [preview, setPreview] = useState("");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={createProduct} className="space-y-4 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-black">Add New Product</h2>
      
      {/* Hidden input sends the base64 string to server */}
      <input type="hidden" name="image" value={preview} />

      {/* Image Preview Area */}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 relative">
        <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
        {preview ? (
            <img src={preview} className="h-32 mx-auto object-cover rounded" />
        ) : (
            <div className="text-slate-500">
                <Upload className="mx-auto mb-2" />
                <span className="text-sm">Click to upload image</span>
            </div>
        )}
      </div>

      <input name="name" placeholder="Product Name" className="w-full p-2 border rounded text-black" required />
      
      <div className="grid grid-cols-2 gap-4">
        <input name="price" type="number" step="0.01" placeholder="Price" className="w-full p-2 border rounded text-black" required />
        <input name="stock" type="number" placeholder="Stock" className="w-full p-2 border rounded text-black" required />
      </div>

      <button className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
        Save Product
      </button>
    </form>
  );
}