// @/app/auth/register/page.tsx

import { RegisterForm } from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}
