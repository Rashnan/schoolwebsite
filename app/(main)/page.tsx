"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { updatePageTitle } from "@/lib/metadata";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useRegistration } from "@/contexts/RegistrationContext";

export default function Home() {
  const { getRunnerCount, getTotalAmount } = useRegistration();
  const cartCount = getRunnerCount();
  const cartTotal = getTotalAmount();

  useEffect(() => {
    updatePageTitle("Home");
  }, []);

  return (
    <>
      {/* hero section */}
      <section
        className="relative w-full min-h-[500px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative w-full h-full flex flex-col justify-between items-center p-8">
          <div className="w-2/3 max-w-2xl flex flex-col items-center justify-start pt-8">
            <h1 className="text-center text-xl sm:text-4xl font-bold mb-4 text-white drop-shadow-2xl">
              Welcome to the Race!
            </h1>
            <p className="text-center text-xs sm:text-lg text-white drop-shadow-2xl mb-6">
              Join the excitement and experience the thrill of competition.
              Discover upcoming events, results, and more.
            </p>
          </div>
          <div className="flex justify-center items-center flex-1">
            <Link
              href="/register"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-lg transition-colors duration-200 text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 drop-shadow-xl"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
      {/* race route section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 py-6 md:py-12">
        <div className="w-full md:w-1/2 flex md:justify-end px-6 md:px-0 justify-center">
          <img
            src="/images/run-route.jpg"
            alt="Race event"
            style={{ width: "500px", height: "auto" }}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <div className="md:mx-0 mx-auto w-fit max-w-[600px] px-6 md:px-12">
            <h2 className="text-lg sm:text-2xl font-semibold mb-3">
              MNU Marathon 2026
            </h2>
            <div className="text-gray-700 text-sm sm:text-lg">
              <p className="mb-4">
                The MNU Marathon, set in 2026, will unite students, staff, alumni, and the wider community in a celebration of health, wellbeing, and unity. More than a race, it's a movement to inspire active lifestyles, build connections, and showcase the spirit of Maldives National University.
              </p>
              
              <p className="mb-4">
                As part of the MNU Fahi Sihhath program, the marathon reflects our commitment to promoting holistic health and wellness. With races for all ages and abilities, the event champions inclusivity, sportsmanship, and healthy living. It also supports MNU's vision of internationalization by welcoming diverse participants, strengthening partnerships, and positioning the University as a hub for excellence and wellbeing.
              </p>
              
              <p>
                Join us for the MNU Marathon 2026—a race that goes beyond the finish line to inspire, connect, and advance the mission of Fahi Sihhath.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* sponsors section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-900">
            Our Proud Sponsors
          </h2>
          <p className="text-center text-gray-600 mb-8 md:mb-12">
            Thank you to our amazing partners who make this event possible
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((partner) => (
              <div key={partner} className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 relative overflow-hidden group">
                <div className="w-20 h-12 md:w-24 md:h-16 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <span className="text-white font-medium text-xs relative z-10 drop-shadow-sm">PARTNER</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* age categories table section */}
      <section className="py-6 md:py-12 bg-gray-50">
        <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 md:mb-6">
          Race Events & Details
        </h2>
        <div className="max-w-[90vw] w-fit mx-auto px-4 overflow-x-auto">
          <Table className="bg-white border-2 border-gray-100 rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 px-3 sm:py-3 sm:px-8 bg-gray-100 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="py-2 px-3 sm:py-3 sm:px-8 bg-gray-100 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Distance
                </TableHead>
                <TableHead className="py-2 px-3 sm:py-3 sm:px-8 bg-gray-100 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Start Time
                </TableHead>
                <TableHead className="py-2 px-3 sm:py-3 sm:px-8 bg-gray-100 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Additional Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b">
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">Kids Dash (Ages 12 & under)</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">1 km</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">08:30 AM</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">
                  Ages 12 & under. Parental consent required. Medals and t-shirt for all finishers.
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">5K</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">5 km</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">09:00 AM</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">
                  Open to all. Commemorative t-shirt included for all participants.
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">10K</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">10 km</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">09:45 AM</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">
                  Prizes for top 3 finishers. T-shirt and water stations included.
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">Half Marathon</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">21.1 km</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">10:30 AM</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">
                  Finisher medals, t-shirt, and refreshments included.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">Full Marathon</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">42.2 km</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">11:00 AM</TableCell>
                <TableCell className="py-2 px-3 sm:py-4 sm:px-8 text-xs sm:text-sm">
                  Special recognition, t-shirt, and medical support included.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {/* CTA section */}
      <section className="min-h-[400px] relative py-6 md:py-12 px-6 md:px-0 text-white text-center bg-cover bg-center bg-no-repeat flex justify-center items-center" style={{backgroundImage: "url('/images/marathon-banner.png')"}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-3xl font-bold mb-4">Ready to Join the Race?</h2>
          <p className="mb-6 text-sm sm:text-lg">
            Register now and be a part of an unforgettable event!
          </p>
          
          {cartCount > 0 ? (
            <div className="mb-6">
              <div className="mx-auto max-w-[450px] bg-white/10 rounded-lg p-4 mb-4">
                <p className="text-sm sm:text-lg mb-2">
                  You have {cartCount} {cartCount === 1 ? 'registration' : 'registrations'} in your cart
                </p>
                <p className="text-lg sm:text-xl font-bold">Total: MVR {cartTotal}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register#cart-summary"
                  className="inline-block bg-white font-semibold px-8 py-3 rounded-full shadow transition hover:bg-gray-100 text-blue-900"
                >
                  View cart
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/register"
              className="inline-block bg-white font-semibold px-8 py-3 rounded-full shadow transition hover:bg-gray-100 text-blue-900"
            >
              Register Now
            </Link>
          )}
          
          <p className="mt-6 text-xs sm:text-sm text-blue-200">
            <span className="italic">
              Note: Item collection point is at <strong>MNU Central Administration</strong>.
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
