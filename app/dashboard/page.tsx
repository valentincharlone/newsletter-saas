"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Sparkles, Settings, CheckCircle2 } from "lucide-react";
import HowWorks from "@/components/HowWorks";
import QuickActions from "@/components/QuickActions";
import SettingsPreferences from "@/components/SettingsPreferences";
import SubscripcionStatus from "@/components/SubscripcionStatus";

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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Spinner size="lg" color="primary" />
              <p className="text-slate-600 dark:text-slate-400">
                Cargando tu dashboard...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "error"
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
                : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {/* Main Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 text-balance">
            Bienvenido a tu Newsletter Personalizado
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Gestiona tus preferencias y mantente informado con contenido curado
            por IA
          </p>
        </div>

        {!preferences ? (
          <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
            <CardBody>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                  <Settings className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
                  Aún no has configurado tus preferencias
                </p>
                <Button
                  as={Link}
                  href="/select"
                  color="primary"
                  size="lg"
                  startContent={<Sparkles className="h-4 w-4" />}
                >
                  Configurar Newsletter
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <SubscripcionStatus status={preferences.is_active} />

            <SettingsPreferences preferences={preferences} />

            <QuickActions
              preferences={preferences}
              handleUpdatePreferences={handleUpdatePreferences}
              handleDeactivateNewsletter={handleDeactivateNewsletter}
              handleActivateNewsletter={handleActivateNewsletter}
            />

            <HowWorks />
          </div>
        )}
      </div>
    </main>
  );
}
