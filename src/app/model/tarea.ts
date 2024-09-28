import { Persona } from "./persona";

export interface Tarea {
    id: number;
    titulo: string;
    completada: boolean;
    fechaLimite:Date,
    personas: Persona[];
  }