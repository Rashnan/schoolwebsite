import Footer from "@/components/footer";

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
      <Footer />
    </div>
  );
}
