import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMantePro } from "@/context/MantePro";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/fichas")({
  head: () => ({
    meta: [
      { title: "Fichas Técnicas — MantePro" },
      { name: "description", content: "Documentación técnica de las máquinas." },
    ],
  }),
  component: Page,
});

function Page() {
  const { sheets, machines } = useMantePro();
  return (
    <AppShell title="Fichas Técnicas">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sheets.map((s) => {
          const m = machines.find((x) => x.id === s.machineId);
          return (
            <Card key={s.id} className="bg-card border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{s.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      <span className="font-mono">{m?.code}</span> · {m?.name}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{s.pages} pág.</span>
                      <span>Actualizada {s.updatedAt}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => toast.success("Descargando ficha…")}>
                  <Download className="h-4 w-4 mr-1.5" /> Descargar PDF
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
