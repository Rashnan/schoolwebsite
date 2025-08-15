"use client";

import React from "react";
import Link from "next/link";
import CartIndicator from "./cart-indicator";
import SignInIcon from "./signin-icon";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-xs sm:text-xl font-bold text-blue-900"
          >
            <Image
              src="/images/mnu-logo-small.png"
              alt="MNU Logo"
              className="h-8 sm:h-12 w-auto mr-2 sm:mr-3"
              width={48}
              height={48}
            />
            MNU Marathon
          </Link>

          <nav className="flex items-center space-x-2 md:space-x-4">
            {/* <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link> */}
            <Link
              href="/register"
              className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Register
            </Link>
            <CartIndicator />
            <SignInIcon />
          </nav>
        </div>
      </div>
    </header>
  );
}
