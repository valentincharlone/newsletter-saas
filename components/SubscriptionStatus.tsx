import { Card, CardBody, Chip } from "@heroui/react";
import { CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function SubscriptionStatus({ status }: { status: boolean }) {
  return (
    <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card via-card to-muted/20 overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
          status
            ? "from-chart-4/5 via-chart-2/5 to-chart-1/5 group-hover:opacity-80"
            : "from-muted/10 via-muted/5 to-muted/10 group-hover:opacity-60"
        }`}
      />

      <CardBody className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                status
                  ? "bg-gradient-to-br from-chart-4 to-chart-2 shadow-lg shadow-chart-4/30"
                  : "bg-gradient-to-br from-muted-foreground to-muted shadow-lg shadow-muted/30"
              }`}
            >
              {status ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <XCircle className="h-8 w-8 text-white" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp
                  className={`h-3.5 w-3.5 ${
                    status ? "text-chart-4" : "text-muted-foreground"
                  }`}
                />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Estado de tu Newsletter
                </p>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {status
                  ? "Todo funcionando perfectamente"
                  : "Newsletter pausado"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {status
                  ? "Recibirás las últimas actualizaciones"
                  : "No recibirás emails temporalmente"}
              </p>
            </div>
          </div>

          <Chip
            color={status ? "success" : "default"}
            variant="flat"
            size="lg"
            className={`font-semibold px-6 py-5 transition-all duration-300 hover:scale-105 ${
              status
                ? "bg-chart-4/20 text-chart-4 border-2 border-chart-4/30"
                : "bg-muted text-muted-foreground border-2 border-border"
            }`}
            startContent={
              status ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )
            }
          >
            {status ? "Activo" : "Pausado"}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}
