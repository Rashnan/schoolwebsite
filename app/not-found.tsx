import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            The page you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
        </div>
        <Button asChild className="!text-white/50 hover:!text-white">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
