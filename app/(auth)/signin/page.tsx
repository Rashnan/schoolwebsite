import { SigninForm } from "@/components/forms/Signin-Form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your MNU Marathon account to manage your race registrations.",
};

export default function SignInRoute() {
  return <SigninForm />;
}
