import { Card, CardHeader, Chip } from "@heroui/react";
import React from "react";

export default function SubscripcionStatus({ status }: { status: boolean }) {
  return (
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
          color={status ? "success" : "default"}
          variant="flat"
          size="lg"
          className="font-semibold"
        >
          {status ? "Activo" : "Pausado"}
        </Chip>
      </CardHeader>
    </Card>
  );
}
