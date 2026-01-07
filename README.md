# Admin Dashboard & Product Management System

## **Project Overview**
This is a full-stack Admin Dashboard built with **Next.js 15 (App Router)**, designed to manage product inventory, track sales, and visualize revenue in real-time. It leverages **Server-Side Rendering (SSR)** for performance and SEO, with secure authentication and instant data updates.

### **Key Features**
* **Server-Side Architecture:** Powered by Next.js App Router and React Server Components.
* **Secure Authentication:** Admin login system using NextAuth.js (v5).
* **Real-time Dashboard:** Dynamic calculation of Total Revenue, Units Sold, and Active Products using live database aggregation.
* **Product Management (CRUD):**
    * **Create:** Add products with Name, Price, Stock, Sales figures, and Images.
    * **Read:** View products in a responsive table and grid layout.
    * **Update:** Edit product details and replace images instantly.
    * **Delete:** Remove products securely from the database.
* **Instant Image Handling:** Custom Base64 image encoding for easy database storage and immediate preview without external storage buckets.
* **Responsive UI:** Built with Tailwind CSS for seamless mobile and desktop compatibility.

---

## **Tech Stack**

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Rendering** | Server Side Rendering (SSR) & Server Actions |
| **Database** | MongoDB (via Mongoose) |
| **Styling** | Tailwind CSS |
| **Auth** | NextAuth.js (v5) |
| **Icons** | Lucide React |

---

## **Installation & Setup**

### **Prerequisites**
* Node.js (v18 or higher)
* MongoDB URI (Local or Atlas)

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd <project-folder-name>
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add the following keys:

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/admin-panel

# Authentication Secret (Generate one using: openssl rand -base64 32)
AUTH_SECRET=your_super_secret_key_here

# Public URL (Required for NextAuth in production)
NEXTAUTH_URL=http://localhost:3000
```

### **4. Run the Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## **Project Structure**

```
src/
├── app/
│   ├── dashboard/          # Protected Dashboard Route (Server Component)
│   │   ├── page.tsx        # Main Dashboard UI (Fetches data serverside)
│   ├── login/              # Login Page
│   ├── products/           # Product Routes
│   │   ├── new/            # Add Product Page
│   │   ├── [id]/edit/      # Edit Product Page
│   ├── globals.css         # Global Styles (Input resets, colors)
│   └── layout.tsx          # Root Layout
├── components/
│   ├── dashboard/
│   │   └── DashboardCharts.tsx  # Client Component for visualization
│   └── ProductFrom.tsx     # Reusable Form for Add/Edit (Handles images)
├── lib/
│   ├── actions.ts          # Server Actions (CRUD Logic)
│   ├── db.ts               # MongoDB Connection Helper
│   └── auth.ts             # NextAuth Configuration
├── models/
│   └── Product.ts          # Mongoose Schema for Products
└── middleware.ts           # Route Protection (Redirects unauth users)
```

---

## **Architecture & Data Flow**

### **Server-Side Rendering (SSR)**
* **Dashboard (`page.tsx`):** Fetches data directly from MongoDB on the server before sending HTML to the browser. This ensures that calculations like `Revenue = Sum(Price * Sales)` are secure and fast.
* **Server Actions (`actions.ts`):** All database mutations (Create, Update, Delete) happen securely on the server, triggered by client-side forms.

### **Image Logic**
To simplify deployment and avoid external cloud storage dependencies:
1.  Images are converted to **Base64 strings** in the browser using the `FileReader` API.
2.  The string is sent to the database via a hidden input field.
3.  This allows for instant previews and simple portability.

---

#### Dummy Admin Credentials 
**Email-ID:** admin@example.com
**Password:** password123

### Demo Video
[Demo Video](https://github.com/user-attachments/assets/088972b2-2af2-4069-b5a1-3f45d0183ec5)

