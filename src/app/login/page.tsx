"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  // Fixed: using useActionState for React 19/Next.js 15
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Admin Login</h1>
        
        <form action={dispatch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  // FIXED: Added text-black
                  className="w-full pl-10 p-2 border border-slate-300 rounded text-black outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  name="password" 
                  // FIXED: Added text-black
                  className="w-full pl-10 p-2 border border-slate-300 rounded text-black outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
            </div>
          </div>

          <LoginButton />
          
          {errorMessage && (
             <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors">
      {pending ? "Logging in..." : "Sign In"}
    </button>
  );
}