"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

// --- AUTHENTICATION ---
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

// --- DATA FETCHING ---
export async function getProducts() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return products.map((p: any) => ({
      _id: p._id.toString(),
      name: p.name,
      price: p.price,
      stock: p.stock,
      sales: p.sales,
      image: p.image || "", 
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
    try {
      await connectToDatabase();
      const product = await Product.findById(id).lean();
      if(!product) return null;
      return {
        _id: product._id.toString(),
        name: product.name,
        price: product.price,
        stock: product.stock,
        sales: product.sales,
        image: product.image || "",
      };
    } catch (error) {
      return null;
    }
}

// --- PRODUCT ACTIONS ---

export async function createProduct(formData: FormData) {
  try {
    await connectToDatabase();
    
    const name = formData.get("name");
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const image = formData.get("image"); 

    if (!name || !price) throw new Error("Missing required fields");

    await Product.create({ name, price, stock, sales: 0, image });
    revalidatePath("/dashboard"); 
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create product.");
  }
}

// This is the function that was missing
export async function updateProduct(formData: FormData) {
  try {
    await connectToDatabase();
    
    const id = formData.get("id");
    const name = formData.get("name");
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const image = formData.get("image"); 

    if (!id) throw new Error("Missing Product ID");

    // Only update image if a new one is provided (string length > 0)
    const updateData: any = { name, price, stock };
    if (image && image.toString().length > 0) {
        updateData.image = image;
    }

    await Product.findByIdAndUpdate(id, updateData);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update product.");
  }
}

export async function deleteProduct(formData: FormData) {
  try {
    await connectToDatabase();
    const id = formData.get("id");
    if (!id) throw new Error("Missing Product ID");
    await Product.findByIdAndDelete(id);
    revalidatePath("/dashboard");
  } catch (error) {
    throw new Error("Failed to delete product.");
  }
}