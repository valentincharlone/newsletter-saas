import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Calendar, Mail, Settings, Sparkles } from "lucide-react";
import React from "react";

interface SettingsPreferencesProps {
  preferences: {
    categories: string[];
    frequency: string;
    email: string;
    is_active: boolean;
    created_at: string;
  };
}

export default function SettingsPreferences({
  preferences,
}: SettingsPreferencesProps) {
  return (
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
            {new Date(preferences.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
