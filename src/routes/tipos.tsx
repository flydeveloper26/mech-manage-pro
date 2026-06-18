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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tipos")({
  head: () => ({
    meta: [
      { title: "Tipos de Mantenimiento — MantePro" },
      { name: "description", content: "Catálogo de tipos de mantenimiento." },
    ],
  }),
  component: Page,
});

const catTone: Record<string, string> = {
  Preventivo: "bg-success/15 text-success border-success/30",
  Correctivo: "bg-critical/15 text-critical border-critical/30",
  Predictivo: "bg-info/15 text-info border-info/30",
};

function Page() {
  const { types, addType, deleteType } = useMantePro();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Preventivo" as const, frequencyDays: 30, description: "" });

  return (
    <AppShell title="Tipos de Mantenimiento">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nuevo tipo</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Nuevo tipo de mantenimiento</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Categoría</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preventivo">Preventivo</SelectItem>
                      <SelectItem value="Correctivo">Correctivo</SelectItem>
                      <SelectItem value="Predictivo">Predictivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Frecuencia (días)</Label><Input type="number" value={form.frequencyDays} onChange={(e) => setForm({ ...form, frequencyDays: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={() => { if (!form.name) return toast.error("Nombre requerido"); addType(form); toast.success("Tipo creado"); setOpen(false); }}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((t) => (
          <Card key={t.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold">{t.name}</div>
                  <span className={`mt-1 inline-flex rounded-md border px-2 py-0.5 text-xs ${catTone[t.category]}`}>{t.category}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-critical"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar tipo?</AlertDialogTitle><AlertDialogDescription>Acción permanente.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => { deleteType(t.id); toast.success("Eliminado"); }}>Eliminar</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                Frecuencia: <span className="font-mono text-foreground">{t.frequencyDays > 0 ? `${t.frequencyDays} días` : "Bajo demanda"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
