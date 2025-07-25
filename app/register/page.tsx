import RegistrationForm from "@/components/registration-form";
import Footer from "@/components/footer";

export default function RegisterPage() {
    return (
        <>
            <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <RegistrationForm />
            </main>
            <Footer />
        </>
    )
}