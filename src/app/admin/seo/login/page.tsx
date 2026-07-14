import { Suspense } from "react";
import AdminSeoLoginPage from "./page-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-white/50">Loading…</p>}>
      <AdminSeoLoginPage />
    </Suspense>
  );
}
