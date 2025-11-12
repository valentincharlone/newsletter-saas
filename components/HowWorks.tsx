import { Mail, Pause, Settings, Sparkles } from "lucide-react";

export default function HowWorks() {
  const features = [
    {
      icon: Sparkles,
      text: "Tu newsletter se genera automáticamente basándose en las categorías que seleccionaste",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      icon: Mail,
      text: "Los newsletters se envían a tu correo a las 9 AM según la frecuencia que elegiste",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: Pause,
      text: "Puedes pausar o reanudar tu newsletter en cualquier momento",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: Settings,
      text: "Actualiza tus preferencias cuando quieras para cambiar las categorías o la frecuencia",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Información
        </div>
        <h3 className="text-2xl font-semibold text-foreground">
          Cómo funciona
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          Tu newsletter personalizado en 4 simples pasos
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group relative flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Step number badge */}
              <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-black text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                {index + 1}
              </div>

              {/* Icon container with color */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className={`w-6 h-6 ${feature.color}`} />
              </div>

              {/* Text content */}
              <div className="flex-1 pt-1">
                <p className="text-sm text-foreground leading-relaxed">
                  {feature.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
