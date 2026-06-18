import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — MantePro" },
      { name: "description", content: "Preferencias de la organización y el sistema." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Configuración">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Organización</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Nombre de la planta</Label><Input defaultValue="Planta Industrial Norte" /></div>
            <div><Label>Responsable</Label><Input defaultValue="J. Mendoza" /></div>
            <div><Label>Zona horaria</Label><Input defaultValue="Europe/Madrid" /></div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Notificaciones</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Alertas de MP próximos", desc: "Avisa 7 días antes del próximo mantenimiento" },
              { label: "Cambios de estado críticos", desc: "Notifica cuando una máquina entra en Crítico" },
              { label: "Resumen semanal por email", desc: "Reporte cada lunes a las 08:00" },
            ].map((n, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{n.label}</div>
                  <div className="text-xs text-muted-foreground">{n.desc}</div>
                </div>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Preferencias</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => toast.success("Preferencias guardadas")}>Guardar cambios</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
