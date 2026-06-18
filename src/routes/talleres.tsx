import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMantePro } from "@/context/MantePro";
import { Plus, Trash2, Store, Phone, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/talleres")({
  head: () => ({
    meta: [
      { title: "Talleres Externos — MantePro" },
      { name: "description", content: "Talleres externos y servicios contratados." },
    ],
  }),
  component: Page,
});

function Page() {
  const { workshops, machines, addWorkshop, deleteWorkshop } = useMantePro();
  const inWorkshopCount = machines.filter((m) => m.status === "En Taller").length;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", phone: "", specialty: "", machinesInService: 0 });

  return (
    <AppShell title="Talleres Externos">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="text-sm text-muted-foreground">
          {inWorkshopCount} máquinas actualmente en taller externo
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nuevo taller</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Nuevo taller</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Contacto</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div><Label>Especialidad</Label><Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={() => { if (!form.name) return toast.error("Nombre requerido"); addWorkshop(form); toast.success("Taller creado"); setOpen(false); }}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {workshops.length === 0 ? (
        <Card className="bg-card border-border border-dashed"><CardContent className="p-12 text-center">
          <Store className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <div className="mt-3 font-medium">Sin talleres registrados</div>
        </CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((w) => (
            <Card key={w.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{w.name}</div>
                    <div className="text-xs text-muted-foreground">{w.specialty}</div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-critical"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader><AlertDialogTitle>¿Eliminar taller?</AlertDialogTitle><AlertDialogDescription>Acción permanente.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => { deleteWorkshop(w.id); toast.success("Eliminado"); }}>Eliminar</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><User className="h-3.5 w-3.5" /> {w.contact}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> <span className="font-mono text-xs">{w.phone}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                  Máquinas en servicio: <span className="text-primary font-semibold">{w.machinesInService}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
