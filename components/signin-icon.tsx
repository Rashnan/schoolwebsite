"use client";

import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

export default function SignInIcon() {
  return (
    <Link
      href="/signin"
      className="relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 transition-colors"
    >
      <User className="w-5 h-5 sm:w-6 sm:h-6" />
    </Link>
  );
}
