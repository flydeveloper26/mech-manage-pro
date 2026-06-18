import { createContext, useContext, useState, type ReactNode } from "react";

export type MachineStatus = "Operativo" | "En Revisión" | "En Taller" | "Fuera de Servicio";
export type Criticality = "Alto" | "Medio" | "Bajo";

export interface CriticalComponent {
  id: string;
  name: string;
  function: string;
  state: string;
  criticality: Criticality;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  brand: string;
  model: string;
  serial?: string;
  purchaseDate?: string;
  cost?: number;
  area?: string;
  department?: string;
  powerKw?: number;
  voltageV?: number;
  frequencyHz?: number;
  weightKg?: number;
  annualHours?: number;
  daysPerWeek?: number;
  status: MachineStatus;
  criticality: Criticality;
  observations?: string;
  photo?: string;
  hoursOfUse: number;
  components: CriticalComponent[];
  sheetUpdatedAt?: string;
  // legacy compat
  location: string;
  acquiredAt: string;
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
  updateMachine: (id: string, m: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  addRecord: (r: Omit<MaintenanceRecord, "id">) => void;
  deleteRecord: (id: string) => void;
  addType: (t: Omit<MaintenanceType, "id">) => void;
  deleteType: (id: string) => void;
  addWorkshop: (w: Omit<Workshop, "id">) => void;
  deleteWorkshop: (id: string) => void;
  upsertComponent: (machineId: string, c: CriticalComponent) => void;
  deleteComponent: (machineId: string, componentId: string) => void;
}

const Ctx = createContext<State | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

const initialMachines: Machine[] = [
  {
    id: "m1", code: "FRS-001", name: "Fresadora/Taladro-Fresadora", brand: "Sieg", model: "ZX7032",
    serial: "ZX7032-2015-0142", purchaseDate: "2015-06-15", cost: 5800,
    area: "Taller de Mecanizado", department: "Facultad de Ingeniería Mecánica",
    powerKw: 1.5, voltageV: 220, frequencyHz: 60, weightKg: 400,
    annualHours: 300, daysPerWeek: 4,
    status: "Operativo", criticality: "Alto",
    observations: "Equipo de uso académico. Requiere lubricación periódica y revisión de correas trapezoidales.",
    hoursOfUse: 4820,
    components: [
      { id: uid(), name: "Correas trapezoidales", function: "Transmisión motor-husillo", state: "Operativo con desgaste leve", criticality: "Alto" },
      { id: uid(), name: "Guías de desplazamiento", function: "Movimiento de mesa X/Y", state: "Operativo", criticality: "Medio" },
      { id: uid(), name: "Husillo principal", function: "Sujeción y giro de herramienta", state: "Operativo", criticality: "Alto" },
      { id: uid(), name: "Rodamientos del husillo", function: "Soporte rotacional del husillo", state: "Operativo", criticality: "Medio" },
      { id: uid(), name: "Motor eléctrico", function: "Fuente de potencia", state: "Operativo", criticality: "Bajo" },
    ],
    sheetUpdatedAt: new Date().toISOString().slice(0, 10),
    location: "Taller de Mecanizado", acquiredAt: "2015-06-15",
  },
  {
    id: "m2", code: "TRN-002", name: "Torno CNC TC-450", brand: "Haas", model: "TC-450",
    serial: "HAAS-TC450-9821", purchaseDate: "2019-07-22", cost: 48500,
    area: "Nave A - Línea 2", department: "Producción",
    powerKw: 11, voltageV: 380, frequencyHz: 60, weightKg: 2200,
    annualHours: 1800, daysPerWeek: 6,
    status: "En Revisión", criticality: "Alto",
    hoursOfUse: 9120, components: [],
    location: "Nave A - Línea 2", acquiredAt: "2019-07-22",
  },
  {
    id: "m3", code: "PRS-003", name: "Prensa Hidráulica P-200", brand: "Enerpac", model: "P-200",
    serial: "ENP-200-3344", purchaseDate: "2018-01-10", cost: 22000,
    area: "Nave B - Estampado", department: "Producción",
    powerKw: 7.5, voltageV: 380, frequencyHz: 60, weightKg: 1800,
    annualHours: 1500, daysPerWeek: 5,
    status: "En Taller", criticality: "Medio",
    hoursOfUse: 12450, components: [],
    location: "Nave B - Estampado", acquiredAt: "2018-01-10",
  },
  {
    id: "m4", code: "SLD-004", name: "Soldadora MIG-350", brand: "Lincoln", model: "MIG-350",
    serial: "LIN-MIG350-7711", purchaseDate: "2022-09-05", cost: 3200,
    area: "Nave B - Soldadura", department: "Producción",
    powerKw: 12, voltageV: 220, frequencyHz: 60, weightKg: 95,
    annualHours: 900, daysPerWeek: 5,
    status: "Operativo", criticality: "Bajo",
    hoursOfUse: 2100, components: [],
    location: "Nave B - Soldadura", acquiredAt: "2022-09-05",
  },
  {
    id: "m5", code: "CMP-005", name: "Compresor Industrial CI-75", brand: "Atlas Copco", model: "CI-75",
    serial: "AC-CI75-0021", purchaseDate: "2017-04-18", cost: 18900,
    area: "Sala de Máquinas", department: "Servicios",
    powerKw: 55, voltageV: 380, frequencyHz: 60, weightKg: 950,
    annualHours: 4000, daysPerWeek: 7,
    status: "Fuera de Servicio", criticality: "Alto",
    hoursOfUse: 18900, components: [],
    location: "Sala de Máquinas", acquiredAt: "2017-04-18",
  },
  {
    id: "m6", code: "RCT-006", name: "Rectificadora R-800", brand: "Okuma", model: "R-800",
    serial: "OKU-R800-5512", purchaseDate: "2020-11-30", cost: 31000,
    area: "Nave A - Acabados", department: "Producción",
    powerKw: 5.5, voltageV: 380, frequencyHz: 60, weightKg: 1100,
    annualHours: 1200, daysPerWeek: 5,
    status: "Operativo", criticality: "Medio",
    hoursOfUse: 5630, components: [],
    location: "Nave A - Acabados", acquiredAt: "2020-11-30",
  },
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
  { id: "r10", machineId: "m1", typeId: "t1", date: dMinus(35), technician: "Juan Pérez", notes: "Engrase mensual previo", status: "Completado", cost: 110 },
  { id: "r11", machineId: "m1", typeId: "t4", date: dMinus(90), technician: "Luis Fernández", notes: "Análisis vibracional trimestral", status: "Completado", cost: 220 },
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

export function MantePoProvider({ children }: { children: ReactNode }) {
  const [machines, setMachines] = useState(initialMachines);
  const [types, setTypes] = useState(initialTypes);
  const [records, setRecords] = useState(initialRecords);
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [sheets] = useState(initialSheets);

  const value: State = {
    machines, types, records, workshops, sheets,
    addMachine: (m) => setMachines((x) => [...x, { ...m, id: uid() }]),
    updateMachine: (id, patch) => setMachines((x) => x.map((m) => (m.id === id ? { ...m, ...patch } : m))),
    deleteMachine: (id) => setMachines((x) => x.filter((m) => m.id !== id)),
    addRecord: (r) => setRecords((x) => [{ ...r, id: uid() }, ...x]),
    deleteRecord: (id) => setRecords((x) => x.filter((r) => r.id !== id)),
    addType: (t) => setTypes((x) => [...x, { ...t, id: uid() }]),
    deleteType: (id) => setTypes((x) => x.filter((t) => t.id !== id)),
    addWorkshop: (w) => setWorkshops((x) => [...x, { ...w, id: uid() }]),
    deleteWorkshop: (id) => setWorkshops((x) => x.filter((w) => w.id !== id)),
    upsertComponent: (machineId, c) => setMachines((x) => x.map((m) => {
      if (m.id !== machineId) return m;
      const exists = m.components.some((k) => k.id === c.id);
      const components = exists ? m.components.map((k) => (k.id === c.id ? c : k)) : [...m.components, c];
      return { ...m, components, sheetUpdatedAt: new Date().toISOString().slice(0, 10) };
    })),
    deleteComponent: (machineId, componentId) => setMachines((x) => x.map((m) =>
      m.id === machineId ? { ...m, components: m.components.filter((c) => c.id !== componentId), sheetUpdatedAt: new Date().toISOString().slice(0, 10) } : m,
    )),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMantePro() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMantePro must be used inside MantePoProvider");
  return ctx;
}

export const nextCode = (machines: Machine[], prefix = "MAQ") => {
  const nums = machines.map((m) => Number(m.code.split("-")[1])).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
};
