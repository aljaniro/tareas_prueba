import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  
} from '@angular/forms';

import { TareasService } from 'src/app/services/tareas.service';
import { Persona } from '../../model/persona';

import { Tarea } from 'src/app/model/tarea';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
})
export class TareasComponent implements OnInit {
  tareaForm: FormGroup;
  tareas: Tarea[] = [];
  habil = [];
  constructor(
    private fb: FormBuilder,
    private tareaServi: TareasService,
    private ruta: Router
  ) {
    this.tareaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      fechaLimite: ['', Validators.required],
      personas: this.fb.array([]),
    });

    this.tareas = this.tareaServi.listaSignal();
  }

  ngOnInit(): void {}

  get personas() {
    return this.tareaForm.get('personas') as FormArray;
  }

  agregarPersona() {
    const personaForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(5)]],
      edad: ['', [Validators.required, Validators.min(18)]],
      habilidades: this.fb.array([this.fb.control('', Validators.required)]),
    });
    this.personas.push(personaForm);
  }

  eliminarPersona(index: number) {
    this.personas.removeAt(index);
  }

  agregarHabilidad(personaIndex: number) {
    const habilidades = this.personas
      .at(personaIndex)
      .get('habilidades') as FormArray;
    habilidades.push(this.fb.control('', Validators.required));
  }

  eliminarHabilidad(personaIndex: number, habilidadIndex: number) {
    const habilidades = this.personas
      .at(personaIndex)
      .get('habilidades') as FormArray;
    habilidades.removeAt(habilidadIndex);
  }

  //
  agregarTarea() {
    if (this.tareaForm.valid) {
      const nuevaTarea: Tarea = {
        id: this.generarIdUnico(), // Generar un ID único
        titulo: this.tareaForm.get('nombre')?.value,
        fechaLimite: this.tareaForm.get('fechaLimite')?.value,
        completada: false,
        personas: this.tareaForm.get('personas')?.value.map((persona: any) => {
          return {
            nombre: persona.nombreCompleto,
            edad: persona.edad,
            habilidades: persona.habilidades,
          } as Persona;
        }),
      };

      this.tareaServi.agregarTarea(nuevaTarea);
      this.ruta.navigate(['/tareaslista']);
      console.log('valido');
    } else {
      console.log('invalido');
    }
  }
  generarIdUnico(): number {
    let nuevoId: number;
    const idsExistentes = this.tareas.map((tarea) => tarea.id); // Obtener los IDs existentes

    do {
      nuevoId = Math.floor(Math.random() * 10000); // Generar un ID aleatorio entre 0 y 9999
    } while (idsExistentes.includes(nuevoId)); // Verificar si el ID ya existe

    return nuevoId; // Retornar un ID único
  }
  getHabilidades(personaIndex: number): FormArray {
    return this.personas.at(personaIndex).get('habilidades') as FormArray;
  }
}
