import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMantePro } from "@/context/MantePro";
import { Plus, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mantenimientos")({
  head: () => ({
    meta: [
      { title: "Mantenimientos — MantePro" },
      { name: "description", content: "Registros y programación de mantenimientos." },
    ],
  }),
  component: Page,
});

const statusTones: Record<string, string> = {
  "Completado": "bg-success/15 text-success border-success/30",
  "Programado": "bg-info/15 text-info border-info/30",
  "En Proceso": "bg-warning/15 text-warning border-warning/30",
};

function Page() {
  const { records, machines, types, addRecord, deleteRecord } = useMantePro();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    machineId: "", typeId: "", date: new Date().toISOString().slice(0, 10),
    technician: "", notes: "", status: "Programado" as "Completado" | "Programado" | "En Proceso", cost: 0,
  });

  const submit = () => {
    if (!form.machineId || !form.typeId) { toast.error("Selecciona máquina y tipo"); return; }
    addRecord(form);
    toast.success("Mantenimiento registrado");
    setOpen(false);
  };

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell title="Mantenimientos">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Nuevo registro</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Registrar mantenimiento</DialogTitle></DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Máquina</Label>
                <Select value={form.machineId} onValueChange={(v) => setForm({ ...form, machineId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {machines.map((m) => <SelectItem key={m.id} value={m.id}>{m.code} — {m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo</Label>
                <Select value={form.typeId} onValueChange={(v) => setForm({ ...form, typeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {types.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Técnico</Label><Input value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} /></div>
              <div>
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programado">Programado</SelectItem>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Costo (€)</Label><Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} /></div>
              <div className="sm:col-span-2"><Label>Notas</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={submit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 ? (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="p-12 text-center">
            <Wrench className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <div className="mt-3 font-medium">Sin mantenimientos</div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Máquina</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Técnico</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-right p-3">Costo</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => {
                  const m = machines.find((x) => x.id === r.machineId);
                  const t = types.find((x) => x.id === r.typeId);
                  return (
                    <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="p-3 whitespace-nowrap">{new Date(r.date).toLocaleDateString("es")}</td>
                      <td className="p-3"><span className="font-mono text-xs text-primary">{m?.code}</span> · <span className="text-foreground">{m?.name}</span></td>
                      <td className="p-3">{t?.name}</td>
                      <td className="p-3">{r.technician}</td>
                      <td className="p-3"><span className={`inline-flex rounded-md border px-2 py-0.5 text-xs ${statusTones[r.status]}`}>{r.status}</span></td>
                      <td className="p-3 text-right font-mono">{r.cost ? `€${r.cost}` : "—"}</td>
                      <td className="p-3 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-critical"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { deleteRecord(r.id); toast.success("Eliminado"); }}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
