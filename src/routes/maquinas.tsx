import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { useMantePro, type MachineStatus } from "@/context/MantePro";
import { Plus, Trash2, Factory, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/maquinas")({
  head: () => ({
    meta: [
      { title: "Máquinas — MantePro" },
      { name: "description", content: "Registro y gestión de máquinas industriales." },
    ],
  }),
  component: MachinesPage,
});

function MachinesPage() {
  const { machines, addMachine, deleteMachine } = useMantePro();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "", name: "", model: "", brand: "", location: "",
    status: "Operativo" as MachineStatus, acquiredAt: "", hoursOfUse: 0,
  });

  const filtered = machines.filter((m) => {
    const s = q.toLowerCase();
    return !s || m.code.toLowerCase().includes(s) || m.name.toLowerCase().includes(s) || m.brand.toLowerCase().includes(s);
  });

  const submit = () => {
    if (!form.code || !form.name) {
      toast.error("Código y nombre son obligatorios");
      return;
    }
    addMachine(form);
    toast.success(`Máquina ${form.code} creada`);
    setOpen(false);
    setForm({ code: "", name: "", model: "", brand: "", location: "", status: "Operativo", acquiredAt: "", hoursOfUse: 0 });
  };

  return (
    <AppShell title="Máquinas">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar por código, nombre o marca…" className="pl-8 bg-card" />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto"><Plus className="h-4 w-4 mr-1" /> Nueva máquina</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Registrar máquina</DialogTitle></DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Código</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="FRS-007" /></div>
              <div><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Marca</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div><Label>Modelo</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Ubicación</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div>
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as MachineStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Operativo", "En Revisión", "En Taller", "Fuera de Servicio"] as const).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Adquirida</Label><Input type="date" value={form.acquiredAt} onChange={(e) => setForm({ ...form, acquiredAt: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={submit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="p-12 text-center">
            <Factory className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <div className="mt-3 font-medium">No hay máquinas</div>
            <div className="text-sm text-muted-foreground">Registra tu primera máquina para empezar.</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => (
            <Card key={m.id} className="bg-card border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-primary">{m.code}</div>
                    <div className="font-semibold truncate">{m.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.brand} · {m.model}</div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div><dt className="text-muted-foreground">Ubicación</dt><dd className="truncate">{m.location || "—"}</dd></div>
                  <div><dt className="text-muted-foreground">Horas uso</dt><dd className="font-mono">{m.hoursOfUse.toLocaleString()}</dd></div>
                  <div className="col-span-2"><dt className="text-muted-foreground">Adquirida</dt><dd>{m.acquiredAt || "—"}</dd></div>
                </dl>
                <div className="mt-4 flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-critical hover:text-critical">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar {m.code}?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { deleteMachine(m.id); toast.success("Máquina eliminada"); }}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
