"use client";

import React from "react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";

export default function SignInIcon() {
  return (
    <Link
      href="/signin"
      className="relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 transition-colors"
    >
      <CircleUserRound />
    </Link>
  );
}
