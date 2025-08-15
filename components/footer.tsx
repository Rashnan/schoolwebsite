import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SiFacebook, SiInstagram, SiTiktok, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <footer className="py-8 bg-gray-100 text-center text-gray-700">
      {/* MNU Logo and Organizer using Card */}
      <div className="w-full flex justify-center mb-4 md:mb-0">
        <Card className="w-fit text-center shadow-none border-none bg-transparent p-0">
          <CardContent className="flex flex-col items-center p-0">
            <Link
              href="https://mnu.edu.mv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MNU Home"
            >
              <img
                src="/images/mnu-logo.png"
                alt="Maldives National University Logo"
                style={{ width: "150px", height: "auto" }}
                className="sm:w-[200px] mx-auto mb-2"
              />
            </Link>
            <p className="text-xs sm:text-sm text-gray-500">
              Organized by Maldives National University
            </p>
          </CardContent>
        </Card>
      </div>
      <hr className="my-6 max-w-7xl w-3/4 mx-auto" />
      <div className="container w-fit min-w-[200px] md:w-full mx-auto flex flex-col items-center gap-0 md:flex-row md:justify-between md:items-start md:gap-12 px-4 md:px-12">
        {/* Useful Links Section */}
        <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3 mb-4 md:mb-0">
          <div className="w-full md:w-fit text-left">
            <p className="text-sm sm:text-base font-semibold">Useful Links</p>
            <ul>
              <li>
                <Link href="/" className="text-xs sm:text-sm transition hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs sm:text-sm transition hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/races/latest"
                  className="text-xs sm:text-sm transition hover:underline"
                >
                  Latest Race
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* MNU Address Section */}
        <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3 mb-4 md:mb-0">
          <div className="w-full md:w-fit text-left">
            <p className="text-sm sm:text-base font-semibold">Address</p>
            <p className="text-xs sm:text-sm">MNU Central Administration,</p>
            <p className="text-xs sm:text-sm">Rahdhebai Hingun,</p>
            <p className="text-xs sm:text-sm">Malé 20371, Maldives</p>
          </div>
        </div>
        {/* Further Contact Section */}
        <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3">
          <div className="w-full md:w-fit text-left">
            <p className="mb-1 text-sm sm:text-base font-semibold">Further Contact</p>
            <p className="text-xs sm:text-sm">
              Email:{" "}
              <Link
                href="mailto:mnumarathon@mnu.edu.mv"
                className="transition hover:underline"
              >
                mnumarathon@mnu.edu.mv
              </Link>
            </p>
            <p className="text-xs sm:text-sm">
              Phone:{" "}
              <Link
                href="tel:+9603345400"
                className="transition hover:underline"
              >
                +960 3345400
              </Link>
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="https://www.facebook.com/share/1B9nuL74ZR/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition hover:text-blue-600"
              >
                <SiFacebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/mnumarathon?igsh=MXV0cWVuaWV6bjJ6eQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition hover:text-pink-600"
              >
                <SiInstagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="https://www.tiktok.com/@mnumarathon?_t=ZS-8yu1LYl6zSK&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="transition hover:text-black"
              >
                <SiTiktok className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <hr className="block md:hidden my-6 max-w-7xl w-3/4 mx-auto" />
      <p className="mt-6 text-xs sm:text-sm text-center">
        &copy; {new Date().getFullYear()} MNU. All rights reserved.
      </p>
    </footer>
  );
}
