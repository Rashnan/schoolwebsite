import Footer from "@/components/footer";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
      {/* Full viewport container for auth form */}
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6">
        {children}
      </div>
      {/* Footer below the main container */}
      <Footer />
    </>
  );
}
