"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import {
  Sparkles,
  Mail,
  Calendar,
  Settings,
  Play,
  Pause,
  CheckCircle2,
} from "lucide-react";

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
            {/* Status Card */}
            <Card className="lg:col-span-3 shadow-lg border-l-4 border-l-blue-500">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Estado del Newsletter
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Tu suscripción está configurada y lista
                  </p>
                </div>
                <Chip
                  color={preferences.is_active ? "success" : "default"}
                  variant="flat"
                  size="lg"
                  className="font-semibold"
                >
                  {preferences.is_active ? "Activo" : "Pausado"}
                </Chip>
              </CardHeader>
            </Card>

            {/* Preferences Card */}
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Tus Preferencias
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Configuración actual de tu newsletter personalizado
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Sparkles className="h-4 w-4" />
                    Categorías de Interés
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.categories.map((category) => (
                      <Chip
                        key={category}
                        color="primary"
                        variant="flat"
                        size="md"
                        className="capitalize"
                      >
                        {category}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    Frecuencia de Envío
                  </div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white capitalize">
                    {preferences.frequency === "daily"
                      ? "Diario"
                      : preferences.frequency === "weekly"
                      ? "Semanal"
                      : preferences.frequency}
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    Correo Electrónico
                  </div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {preferences.email}
                  </p>
                </div>

                {/* Created Date */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Suscrito desde:{" "}
                    {new Date(preferences.created_at).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Actions Card */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Acciones Rápidas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Gestiona tu suscripción
                </p>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button
                  onClick={handleUpdatePreferences}
                  color="primary"
                  size="lg"
                  className="w-full"
                  startContent={<Settings className="h-4 w-4" />}
                >
                  Actualizar Preferencias
                </Button>

                {preferences.is_active ? (
                  <Button
                    onClick={handleDeactivateNewsletter}
                    variant="bordered"
                    color="warning"
                    size="lg"
                    className="w-full"
                    startContent={<Pause className="h-4 w-4" />}
                  >
                    Pausar Newsletter
                  </Button>
                ) : (
                  <Button
                    onClick={handleActivateNewsletter}
                    variant="bordered"
                    color="success"
                    size="lg"
                    className="w-full"
                    startContent={<Play className="h-4 w-4" />}
                  >
                    Reactivar Newsletter
                  </Button>
                )}

                <Button
                  as={Link}
                  href="/select"
                  variant="light"
                  size="lg"
                  className="w-full"
                >
                  Ver Todas las Opciones
                </Button>
              </CardBody>
            </Card>

            {/* Info Card */}
            <Card className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 shadow-lg">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  ¿Cómo funciona?
                </h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5 text-lg">
                      •
                    </span>
                    <span>
                      Tu newsletter se genera automáticamente basándose en las
                      categorías que seleccionaste
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5 text-lg">
                      •
                    </span>
                    <span>
                      Los newsletters se envían a tu correo a las 9 AM según la
                      frecuencia que elegiste
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5 text-lg">
                      •
                    </span>
                    <span>
                      Puedes pausar o reanudar tu newsletter en cualquier
                      momento
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5 text-lg">
                      •
                    </span>
                    <span>
                      Actualiza tus preferencias cuando quieras para cambiar las
                      categorías o la frecuencia
                    </span>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
