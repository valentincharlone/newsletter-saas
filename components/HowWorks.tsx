import { Mail, Pause, Settings, Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import React from "react";

export default function HowWorks() {
  return (
    <Card className="lg:col-span-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 shadow-xl border border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600 dark:bg-blue-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              ¿Cómo funciona?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Todo lo que necesitas saber sobre tu newsletter
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-blue-100 dark:border-blue-900/50">
            <div className="mt-0.5 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                Tu newsletter se genera automáticamente basándose en las
                categorías que seleccionaste
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-blue-100 dark:border-blue-900/50">
            <div className="mt-0.5 p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
              <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                Los newsletters se envían a tu correo a las 9 AM según la
                frecuencia que elegiste
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-blue-100 dark:border-blue-900/50">
            <div className="mt-0.5 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <Pause className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                Puedes pausar o reanudar tu newsletter en cualquier momento
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-blue-100 dark:border-blue-900/50">
            <div className="mt-0.5 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                Actualiza tus preferencias cuando quieras para cambiar las
                categorías o la frecuencia
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
