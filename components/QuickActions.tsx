"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/react";
import { Settings, Pause, Play, Zap } from "lucide-react";

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
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card">
      <CardBody className="gap-4 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-chart-1/10">
            <Zap className="h-4 w-4 text-chart-1" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Acciones Rápidas
          </h3>
        </div>

        <Button
          onClick={handleUpdatePreferences}
          className="w-full bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md"
          size="lg"
          startContent={<Settings className="h-5 w-5" />}
        >
          Actualizar Preferencias
        </Button>

        {preferences.is_active ? (
          <Button
            onClick={handleDeactivateNewsletter}
            variant="bordered"
            className="w-full border-2 border-chart-3/30 hover:border-chart-3 hover:bg-chart-3/5 transition-all duration-300 hover:scale-[1.02]"
            size="lg"
            startContent={<Pause className="h-5 w-5 text-chart-3" />}
          >
            <span className="text-foreground">Pausar Newsletter</span>
          </Button>
        ) : (
          <Button
            onClick={handleActivateNewsletter}
            variant="bordered"
            className="w-full border-2 border-chart-4/30 hover:border-chart-4 hover:bg-chart-4/5 transition-all duration-300 hover:scale-[1.02]"
            size="lg"
            startContent={<Play className="h-5 w-5 text-chart-4" />}
          >
            <span className="text-foreground">Reactivar Newsletter</span>
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
