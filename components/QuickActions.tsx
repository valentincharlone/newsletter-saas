import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Link, Pause, Settings, Play } from "lucide-react";
import React from "react";

interface QuickActionsProps {
  preferences: {
    is_active: boolean;
  };
  handleUpdatePreferences: () => void;
  handleDeactivateNewsletter: () => void;
  handleActivateNewsletter: () => void;
}

export default function QuickActions({
  preferences,
  handleUpdatePreferences,
  handleDeactivateNewsletter,
  handleActivateNewsletter,
}: QuickActionsProps) {
  return (
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
  );
}
