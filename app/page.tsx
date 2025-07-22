
import Image from "next/image";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";

export default function Home() {
  return (
    <>
      {/* hero section */}
      <section
        className="relative w-full min-h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: "url('https://races.3000tfg.com/wp-content/uploads/2022/04/group-2.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-2/3 max-w-2xl flex flex-col items-center justify-center p-8 bg-black/60 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Welcome to the Race!</h1>
          <p className="text-lg text-white drop-shadow-lg">Join the excitement and experience the thrill of competition. Discover upcoming events, results, and more.</p>
        </div>
      </section>
      {/* race route section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 py-12">
        <div className="w-full md:w-1/2 flex justify-end">
          <Image
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimgv2-1-f.scribdassets.com%2Fimg%2Fdocument%2F623774395%2Foriginal%2F76bf2832da%2F1689482721%3Fv%3D1&f=1&nofb=1&ipt=b74c2fb6b2a5adfd70c7510c860cec200385d2266df56658c92e1a04299995d4"
            alt="Race event"
            width={500}
            height={500}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <div className="max-w-[600px] px-6 md:px-12">
            <h2 className="text-2xl font-semibold mb-3">Experience the Action</h2>
            <p className="text-gray-700 text-lg">
              Our races bring together competitors from all backgrounds to test their skills and push their limits. Whether you're a seasoned racer or a newcomer, there's a place for you on the track. Explore our events, meet fellow enthusiasts, and be part of an unforgettable journey!
            </p>
          </div>
        </div>
      </section>
      {/* age categories table section */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">Race Events & Details</h2>
        <div className="max-w-5xl w-fit mx-auto px-4">
          <Table className="min-w-[900px] bg-white rounded-lg shadow-md">
            <TableHeader>
              <TableRow>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">Name</TableHead>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">Distance</TableHead>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">Start Time</TableHead>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">Additional Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">Kids Race</TableCell>
                <TableCell className="py-4 px-8">1 km</TableCell>
                <TableCell className="py-4 px-8">08:30 AM</TableCell>
                <TableCell className="py-4 px-8">Parental consent required. Medals for all finishers.</TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">5K</TableCell>
                <TableCell className="py-4 px-8">5 km</TableCell>
                <TableCell className="py-4 px-8">09:00 AM</TableCell>
                <TableCell className="py-4 px-8">Open to all. Commemorative t-shirt for participants.</TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">10K</TableCell>
                <TableCell className="py-4 px-8">10 km</TableCell>
                <TableCell className="py-4 px-8">09:45 AM</TableCell>
                <TableCell className="py-4 px-8">Prizes for top 3 finishers. Water stations on course.</TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">Half Marathon</TableCell>
                <TableCell className="py-4 px-8">21.1 km</TableCell>
                <TableCell className="py-4 px-8">10:30 AM</TableCell>
                <TableCell className="py-4 px-8">Finisher medals and refreshments at the finish line.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-4 px-8">Full Marathon</TableCell>
                <TableCell className="py-4 px-8">42.2 km</TableCell>
                <TableCell className="py-4 px-8">11:00 AM</TableCell>
                <TableCell className="py-4 px-8">Special recognition for all finishers. Medical support available.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
      {/* CTA section */}
      <section className="py-12 bg-blue-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join the Race?</h2>

        <p className="mb-6 text-lg">Register now and be a part of an unforgettable event!</p>
        <a
          href="/register"
          className="inline-block bg-white font-semibold px-8 py-3 rounded-full shadow transition"
        >
          Register Now
        </a>
        <p className="mt-6 text-sm text-blue-200">
          <span className="italic">Note: Item collection point is at <strong>MNU location</strong>.</span>
        </p>
      </section>
      {/* footer section */}
      <footer className="py-8 bg-gray-100 text-center text-gray-700">
        {/* MNU Logo and Organizer using Card */}
        <div className="w-full flex justify-center mb-4 md:mb-0">
          <Card className="w-fit text-center shadow-none border-none bg-transparent p-0">
            <CardContent className="flex flex-col items-center p-0">
              <a href="https://mnu.edu.mv" target="_blank" rel="noopener noreferrer" aria-label="MNU Home">
                <img
                  src="https://mnu.edu.mv/wp-content/uploads/2021/12/MNU-Logo-Horizontal-Filled-01-e1638420030168.png"
                  alt="Maldives National University Logo"
                  className="mx-auto h-16 mb-2"
                  style={{ maxHeight: "64px" }}
                />
              </a>
              <p className="text-sm text-gray-500">Organized by Maldives National University</p>
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6 max-w-7xl w-full mx-auto" />
        <div className="container mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-start md:gap-12 px-4 md:px-12">
          {/* Useful Links Section */}
          <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3 mb-4 md:mb-0">
            <div className="w-fit text-left">
              <p className="font-semibold">Useful Links</p>
              <ul>
                <li>
                  <a href="/" className="transition">Home</a>
                </li>
                <li>
                  <a href="/about" className="transition">About</a>
                </li>
                <li>
                  <a href="/races/latest" className="transition">Latest Race</a>
                </li>
              </ul>
            </div>
          </div>

          {/* MNU Address Section */}
          <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3 mb-4 md:mb-0">
            <div className="w-fit text-left">
              <p className="font-semibold">Address</p>
              <p>MNU Central Administration,</p>
              <p>Rahdhebai Hingun,</p>
              <p>Malé 20371, Maldives</p>
            </div>
          </div>
          {/* Further Contact Section */}
          <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3">
            <div className="w-fit text-left">
              <p className="mb-1 font-semibold">Further Contact</p>
              <p>
                Email:{" "}
                <a href="mailto:info@3000tfg.com" className="transition">
                  info@3000tfg.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+9603345400" className="transition">
                  +960 3345400
                </a>
              </p>
              <div className="mt-4">
                <p className="mb-1 font-semibold">Socials</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/mnu.edu.mv"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="inline align-middle">
                      <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/mnu_edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="inline align-middle">
                      <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.633A9.936 9.936 0 0 0 24 4.557z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/mnu.edu.mv"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="inline align-middle">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.388 3.635 1.355c-.967.967-1.225 2.14-1.283 3.417C2.013 5.668 2 6.077 2 9.333v5.334c0 3.256.013 3.665.072 4.945.058 1.277.316 2.45 1.283 3.417.967.967 2.14 1.225 3.417 1.283C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.058 2.45-.316 3.417-1.283.967-.967 1.225-2.14 1.283-3.417.059-1.28.072-1.689.072-4.945V9.333c0-3.256-.013-3.665-.072-4.945-.058-1.277-.316-2.45-1.283-3.417-.967-.967-2.14-1.225-3.417-1.283C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@mnu_edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="inline align-middle">
                      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.425 3.5 12 3.5 12 3.5s-7.425 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.153 0 12 0 12s0 3.847.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.575 20.5 12 20.5 12 20.5s7.425 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.847 24 12 24 12s0-3.847-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-center">
          &copy; {new Date().getFullYear()} MNU. All rights reserved.
        </p>
      </footer>
    </>
  );
}
