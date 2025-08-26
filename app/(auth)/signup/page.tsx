import { SignupForm } from "@/components/forms/Signup-Form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new MNU Marathon account to register for race events.",
};

export default function SingUpRoute() {
  return <SignupForm />;
}
