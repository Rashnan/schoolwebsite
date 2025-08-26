"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useRegistration } from "@/contexts/RegistrationContext";

export default function CartIndicator() {
  const { getRunnerCount } = useRegistration();
  const cartCount = getRunnerCount();

  return (
    <Link 
      href="/register" 
      className="relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 transition-colors"
    >
      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
          {cartCount}
        </span>
      )}
    </Link>
  );
} 