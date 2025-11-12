import { Card, CardBody, Chip } from "@heroui/react"
import { Calendar, Mail, Tag, Clock } from "lucide-react"

interface SettingsPreferencesProps {
  preferences: {
    categories: string[]
    frequency: string
    email: string
    is_active: boolean
    created_at: string
  }
}

export default function SettingsPreferences({ preferences }: SettingsPreferencesProps) {
  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card">
      <CardBody className="gap-6 p-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="p-2 rounded-lg bg-chart-2/10">
            <Tag className="h-4 w-4 text-chart-2" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Tus Preferencias</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-chart-1/10">
              <Tag className="h-3.5 w-3.5 text-chart-1" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Categorías de Interés</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.categories.map((category, index) => (
              <Chip
                key={category}
                variant="flat"
                size="sm"
                className="capitalize bg-gradient-to-r from-chart-1/10 to-chart-2/10 text-foreground font-medium hover:from-chart-1/20 hover:to-chart-2/20 transition-colors duration-200 border border-chart-1/20"
              >
                {category}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-chart-3/5 border border-chart-3/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-chart-3">
              <Calendar className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Frecuencia de Envío</p>
          </div>
          <p className="text-lg font-semibold text-foreground capitalize pl-7">
            {preferences.frequency === "daily"
              ? "📅 Diario"
              : preferences.frequency === "weekly"
                ? "📆 Semanal"
                : preferences.frequency}
          </p>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-chart-4/5 border border-chart-4/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-chart-4">
              <Mail className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Email de Contacto</p>
          </div>
          <p className="text-base font-medium text-foreground break-all pl-7">{preferences.email}</p>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Suscrito desde{" "}
              <span className="font-medium text-foreground">
                {new Date(preferences.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
