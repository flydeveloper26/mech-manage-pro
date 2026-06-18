import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMantePro } from "@/context/MantePro";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/reportes")({
  head: () => ({
    meta: [
      { title: "Reportes — MantePro" },
      { name: "description", content: "Reportes y análisis de mantenimientos." },
    ],
  }),
  component: Page,
});

function Page() {
  const { records, machines, types } = useMantePro();

  const byType = types.map((t) => ({
    name: t.name,
    count: records.filter((r) => r.typeId === t.id).length,
  }));

  const costByMachine = machines.map((m) => ({
    code: m.code,
    cost: records.filter((r) => r.machineId === m.id).reduce((s, r) => s + r.cost, 0),
  })).filter((x) => x.cost > 0);

  const catData = (["Preventivo", "Correctivo", "Predictivo"] as const).map((c) => {
    const typeIds = types.filter((t) => t.category === c).map((t) => t.id);
    return { name: c, value: records.filter((r) => typeIds.includes(r.typeId)).length };
  });

  const colors = ["var(--primary)", "var(--accent)", "var(--success)", "var(--critical)", "var(--chart-5)"];

  return (
    <AppShell title="Reportes">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Mantenimientos por tipo</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Costo acumulado por máquina (€)</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByMachine}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="code" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="cost" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Distribución por categoría</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {catData.map((_, i) => <Cell key={i} fill={colors[i]} stroke="var(--card)" strokeWidth={2} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
