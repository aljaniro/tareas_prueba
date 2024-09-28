import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Persona } from 'src/app/model/persona';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css'],
})
export class PersonasComponent implements OnInit {
  personaForm: FormGroup; // FormGroup para el formulario
  personas: Persona[] = []; // Lista de personas
  @Input() ind: number = 0;
  constructor(private fb: FormBuilder, private tareaserv: TareasService) {
    this.personaForm = this.fb.group({
      nombreCompleto: ['', [Validators.minLength(5), Validators.required]],
      edad: ['', [Validators.required, Validators.min(18)]],
      habilidades: this.fb.array([], this.minLengthArray(1)), // Inicializa un FormArray para las habilidades
    });
  }

  ngOnInit(): void {}

  minLengthArray(min: number) {
    return (control: AbstractControl) => {
      if (control instanceof FormArray) {
        return control.length >= min ? null : { minLengthArray: true };
      }
      return null;
    };
  }
  get habilidades(): FormArray {
    return this.personaForm.get('habilidades') as FormArray; // Getter para acceder al FormArray
  }

  agregarHabilidad() {
    this.habilidades.push(this.fb.control('', Validators.required)); // Agrega un nuevo control para la habilidad
  }

  eliminarHabilidad(index: number) {
    this.habilidades.removeAt(index); // Elimina la habilidad en el índice especificado
  }

  agregarPersona() {
    const name = this.personaForm.value.nombreCompleto;
    console.log(this.ind);
    if (this.personaForm.valid) {
      const persona: Persona = {
        nombre: this.personaForm.value.nombreCompleto,
        edad: this.personaForm.value.edad,
        habilidades: this.personaForm.value.habilidades,
      };
      console.log('es valido');
      this.tareaserv.agregarPersonas(this.ind, persona);
      console;
    }
  }
}
