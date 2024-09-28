import { Injectable } from '@angular/core';
import { Persona } from '../model/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private personas: Persona[] = [];
  constructor() { }
  agregarPersona(persona: Persona) {
    this.personas.push(persona);
  }

  eliminarPersona(persona: Persona) {
    this.personas = this.personas.filter(p => p !== persona);
  }

  agregarHabilidad(id: number, habilidad: string) {
    const persona = this.personas.find(p => p.id === id);
    if (persona) {
      persona.habilidades.push(habilidad);
    }
  }

  eliminarHabilidad(id: number, habilidad: string) {
    const persona = this.personas.find(p => p.id === id);
    if (persona && 'habilidades' in persona) {
      persona.habilidades = persona.habilidades.filter(h => h !== habilidad);
    }
  }
}
