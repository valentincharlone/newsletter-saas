"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { CheckCircle2, Settings, Sparkles } from "lucide-react";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import SettingsPreferences from "@/components/SettingsPreferences";
import QuickActions from "@/components/QuickActions";
import HowWorks from "@/components/HowWorks";

interface UserPreferences {
  categories: string[];
  frequency: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api/user-preferences")
      .then((response) => {
        if (response && response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setPreferences(data);
        }
      })
      .catch(() => {
        router.replace("/select");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleUpdatePreferences = () => {
    router.push("/select");
  };

  const handleDeactivateNewsletter = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: false }),
      });

      if (response.ok) {
        setPreferences((prev) => (prev ? { ...prev, is_active: false } : null));
        setMessage({
          type: "success",
          text: "Newsletter pausado exitosamente",
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error deactivating newsletter:", error);
      setMessage({ type: "error", text: "Error al pausar newsletter" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleActivateNewsletter = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: true }),
      });

      if (response.ok) {
        setPreferences((prev) => (prev ? { ...prev, is_active: true } : null));
        setMessage({
          type: "success",
          text: "Newsletter reactivado exitosamente",
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error activating newsletter:", error);
      setMessage({ type: "error", text: "Error al reactivar newsletter" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = async () => {
    // Add logout logic here
    router.push("/sign-in");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen  dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg ml-14">
            Gestiona tu newsletter personalizado con IA
          </p>
        </div>

        {message && (
          <div
            className={`mb-8 p-4 rounded-2xl border backdrop-blur-sm shadow-lg ${
              message.type === "error"
                ? "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-400"
                : "bg-green-50/80 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-green-900 dark:text-green-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {!preferences ? (
          <Card className="border-2 border-neutral-200/50 dark:border-neutral-800/50 shadow-xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <CardBody>
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-xl opacity-30"></div>
                  <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-6">
                    <Settings className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                  Configura tu Newsletter
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-center max-w-md">
                  Personaliza las categorías y la frecuencia de tu newsletter
                  con IA
                </p>
                <Button
                  as={Link}
                  href="/select"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                  size="lg"
                >
                  Comenzar Ahora
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-8">
            <SubscriptionStatus status={preferences.is_active} />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SettingsPreferences preferences={preferences} />
              </div>

              <div>
                <QuickActions
                  preferences={preferences}
                  handleUpdatePreferences={handleUpdatePreferences}
                  handleDeactivateNewsletter={handleDeactivateNewsletter}
                  handleActivateNewsletter={handleActivateNewsletter}
                />
              </div>
            </div>

            <HowWorks />
          </div>
        )}
      </div>
    </main>
  );
}
