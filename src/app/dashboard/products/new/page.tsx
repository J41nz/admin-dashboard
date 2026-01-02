import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500">Create a new item for your inventory.</p>
      </div>
      <ProductForm isEditMode={false} />
    </div>
  );
}