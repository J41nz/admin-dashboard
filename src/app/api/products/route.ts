import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

// Helper function to upload buffer to Cloudinary
async function uploadToCloudinary(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// GET: Fetch all products
export async function GET() {
  try {
    await connectDB();
    // Sort by createdAt descending (newest first)
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

// ... imports remain the same

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // FIXED: Added check for !session.user
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    // ... rest of the code remains exactly the same as before
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const stock = parseInt(formData.get("stock") as string);
    const imageFile = formData.get("image") as File | null;

    if (!name || !price || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    let imageUrl = "";
    if (imageFile) {
      const url = await uploadToCloudinary(imageFile, "ecommerce-dashboard");
      imageUrl = url as string;
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: imageUrl ? [imageUrl] : [],
      sales: 0,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}

// ... GET function remains the same