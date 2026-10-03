import type { Metadata } from "next";
import { LoginForm } from "@/components/ui/login-form";

export const metadata: Metadata = {
  title: "Masuk — Panel Pengelola",
  description: "Login untuk mengakses panel pengelola Dusun Cilikan.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-paper p-8 shadow-lg shadow-brand-950/5">
        <LoginForm />
      </div>
    </div>
  );
}
