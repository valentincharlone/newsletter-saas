"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleLogOut = async () => {
    await signOut();
    router.push("/signin");
  };

  if (!user) {
    return null;
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold">Personalized AI Newsletter</h1>

          <Button
            color="danger"
            variant="flat"
            size="sm"
            onPress={handleLogOut}
            isLoading={loading}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
