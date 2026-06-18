import { createContext, useContext, useState, type ReactNode } from "react";

export type MachineStatus = "Operativo" | "En Revisión" | "En Taller" | "Fuera de Servicio";

export interface Machine {
  id: string;
  code: string;
  name: string;
  model: string;
  brand: string;
  location: string;
  status: MachineStatus;
  acquiredAt: string;
  hoursOfUse: number;
}

export interface MaintenanceType {
  id: string;
  name: string;
  category: "Preventivo" | "Correctivo" | "Predictivo";
  frequencyDays: number;
  description: string;
}

export interface MaintenanceRecord {
  id: string;
  machineId: string;
  typeId: string;
  date: string;
  technician: string;
  notes: string;
  status: "Completado" | "Programado" | "En Proceso";
  cost: number;
}

export interface Workshop {
  id: string;
  name: string;
  contact: string;
  phone: string;
  specialty: string;
  machinesInService: number;
}

export interface TechSheet {
  id: string;
  machineId: string;
  title: string;
  updatedAt: string;
  pages: number;
}

interface State {
  machines: Machine[];
  types: MaintenanceType[];
  records: MaintenanceRecord[];
  workshops: Workshop[];
  sheets: TechSheet[];
  addMachine: (m: Omit<Machine, "id">) => void;
  deleteMachine: (id: string) => void;
  addRecord: (r: Omit<MaintenanceRecord, "id">) => void;
  deleteRecord: (id: string) => void;
  addType: (t: Omit<MaintenanceType, "id">) => void;
  deleteType: (id: string) => void;
  addWorkshop: (w: Omit<Workshop, "id">) => void;
  deleteWorkshop: (id: string) => void;
}

const Ctx = createContext<State | null>(null);

const initialMachines: Machine[] = [
  { id: "m1", code: "FRS-001", name: "Fresadora ZX7032", model: "ZX7032", brand: "Sieg", location: "Nave A - Línea 1", status: "Operativo", acquiredAt: "2021-03-15", hoursOfUse: 4820 },
  { id: "m2", code: "TRN-002", name: "Torno CNC TC-450", model: "TC-450", brand: "Haas", location: "Nave A - Línea 2", status: "En Revisión", acquiredAt: "2019-07-22", hoursOfUse: 9120 },
  { id: "m3", code: "PRS-003", name: "Prensa Hidráulica P-200", model: "P-200", brand: "Enerpac", location: "Nave B - Estampado", status: "En Taller", acquiredAt: "2018-01-10", hoursOfUse: 12450 },
  { id: "m4", code: "SLD-004", name: "Soldadora MIG-350", model: "MIG-350", brand: "Lincoln", location: "Nave B - Soldadura", status: "Operativo", acquiredAt: "2022-09-05", hoursOfUse: 2100 },
  { id: "m5", code: "CMP-005", name: "Compresor Industrial CI-75", model: "CI-75", brand: "Atlas Copco", location: "Sala de Máquinas", status: "Fuera de Servicio", acquiredAt: "2017-04-18", hoursOfUse: 18900 },
  { id: "m6", code: "RCT-006", name: "Rectificadora R-800", model: "R-800", brand: "Okuma", location: "Nave A - Acabados", status: "Operativo", acquiredAt: "2020-11-30", hoursOfUse: 5630 },
];

const initialTypes: MaintenanceType[] = [
  { id: "t1", name: "Lubricación general", category: "Preventivo", frequencyDays: 30, description: "Engrasado de guías y husillos" },
  { id: "t2", name: "Cambio de aceite hidráulico", category: "Preventivo", frequencyDays: 180, description: "Sustitución completa del fluido hidráulico" },
  { id: "t3", name: "Reparación de motor", category: "Correctivo", frequencyDays: 0, description: "Diagnóstico y reparación de motor eléctrico" },
  { id: "t4", name: "Análisis de vibraciones", category: "Predictivo", frequencyDays: 90, description: "Medición y análisis vibracional" },
  { id: "t5", name: "Inspección eléctrica", category: "Preventivo", frequencyDays: 60, description: "Revisión de conexiones y consumo" },
];

const today = new Date();
const dPlus = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().slice(0, 10);
const dMinus = (d: number) => new Date(today.getTime() - d * 86400000).toISOString().slice(0, 10);

const initialRecords: MaintenanceRecord[] = [
  { id: "r1", machineId: "m1", typeId: "t1", date: dMinus(2), technician: "Juan Pérez", notes: "Lubricación rutinaria", status: "Completado", cost: 120 },
  { id: "r2", machineId: "m2", typeId: "t3", date: dMinus(1), technician: "María López", notes: "Falla en eje principal", status: "En Proceso", cost: 850 },
  { id: "r3", machineId: "m3", typeId: "t2", date: dMinus(5), technician: "Carlos Ruiz", notes: "Cambio programado", status: "Completado", cost: 540 },
  { id: "r4", machineId: "m4", typeId: "t5", date: dMinus(7), technician: "Ana Torres", notes: "Conexiones revisadas", status: "Completado", cost: 90 },
  { id: "r5", machineId: "m6", typeId: "t4", date: dMinus(10), technician: "Luis Fernández", notes: "Vibración dentro de rangos", status: "Completado", cost: 230 },
  { id: "r6", machineId: "m1", typeId: "t5", date: dPlus(3), technician: "Juan Pérez", notes: "Inspección programada", status: "Programado", cost: 0 },
  { id: "r7", machineId: "m4", typeId: "t1", date: dPlus(5), technician: "Ana Torres", notes: "Lubricación mensual", status: "Programado", cost: 0 },
  { id: "r8", machineId: "m6", typeId: "t2", date: dPlus(12), technician: "Carlos Ruiz", notes: "Cambio semestral", status: "Programado", cost: 0 },
  { id: "r9", machineId: "m2", typeId: "t1", date: dPlus(20), technician: "María López", notes: "Engrase general", status: "Programado", cost: 0 },
];

const initialWorkshops: Workshop[] = [
  { id: "w1", name: "Talleres Mecánicos Andina", contact: "Roberto Silva", phone: "+34 911 234 567", specialty: "Mecánica de precisión", machinesInService: 1 },
  { id: "w2", name: "ElectroMotor S.L.", contact: "Patricia Núñez", phone: "+34 912 987 654", specialty: "Bobinado de motores", machinesInService: 0 },
  { id: "w3", name: "HidroServ Industrial", contact: "Miguel Ángel", phone: "+34 913 555 111", specialty: "Sistemas hidráulicos", machinesInService: 0 },
];

const initialSheets: TechSheet[] = [
  { id: "s1", machineId: "m1", title: "Manual Fresadora ZX7032", updatedAt: "2024-08-12", pages: 84 },
  { id: "s2", machineId: "m2", title: "Especificaciones Torno TC-450", updatedAt: "2024-05-03", pages: 120 },
  { id: "s3", machineId: "m3", title: "Plan de mantenimiento Prensa P-200", updatedAt: "2024-09-21", pages: 42 },
  { id: "s4", machineId: "m4", title: "Manual Soldadora MIG-350", updatedAt: "2025-01-10", pages: 56 },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function MantePoProvider({ children }: { children: ReactNode }) {
  const [machines, setMachines] = useState(initialMachines);
  const [types, setTypes] = useState(initialTypes);
  const [records, setRecords] = useState(initialRecords);
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [sheets] = useState(initialSheets);

  const value: State = {
    machines, types, records, workshops, sheets,
    addMachine: (m) => setMachines((x) => [...x, { ...m, id: uid() }]),
    deleteMachine: (id) => setMachines((x) => x.filter((m) => m.id !== id)),
    addRecord: (r) => setRecords((x) => [{ ...r, id: uid() }, ...x]),
    deleteRecord: (id) => setRecords((x) => x.filter((r) => r.id !== id)),
    addType: (t) => setTypes((x) => [...x, { ...t, id: uid() }]),
    deleteType: (id) => setTypes((x) => x.filter((t) => t.id !== id)),
    addWorkshop: (w) => setWorkshops((x) => [...x, { ...w, id: uid() }]),
    deleteWorkshop: (id) => setWorkshops((x) => x.filter((w) => w.id !== id)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMantePro() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMantePro must be used inside MantePoProvider");
  return ctx;
}
