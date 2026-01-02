import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }], // Array of Cloudinary URLs
    sales: { type: Number, default: 0 }, // For chart visualization
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;