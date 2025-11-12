"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Sparkles } from "lucide-react";

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
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Newsletter
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
            </div>
          </div>
          <Button
            variant="light"
            color="danger"
            size="sm"
            onClick={handleLogOut}
            startContent={<LogOut className="h-4 w-4" />}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
