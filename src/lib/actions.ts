"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

// --- AUTH ---
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") return "Invalid credentials.";
      return "Something went wrong.";
    }
    throw error;
  }
}

// --- PRODUCTS ---
export async function getProducts() {
  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return products.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    stock: p.stock,
    sales: p.sales,
    image: p.image || "", // Return Image
  }));
}

export async function createProduct(formData: FormData) {
  try {
    await connectToDatabase();
    
    const name = formData.get("name");
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const image = formData.get("image"); // Capture Image String

    await Product.create({ name, price, stock, sales: 0, image });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Create Error:", error);
    throw new Error("Failed to create product");
  }
}

export async function deleteProduct(formData: FormData) {
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(formData.get("id"));
    revalidatePath("/dashboard");
  } catch (error) {
    throw new Error("Failed to delete product");
  }
}