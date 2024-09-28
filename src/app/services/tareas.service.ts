import { effect, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Tarea } from '../model/tarea';
import { Persona } from '../model/persona';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private tareas: Tarea[] = [];
  
  listaSignal = signal<Tarea[]>([]);
  tareasCompletasSignal = signal<Tarea[]>([]);
  tareasIncompletasSignal = signal<Tarea[]>([]);
  aux = signal<Tarea[]>([]);
  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.cargarTareasIniciales();
  }

  cargarTareasIniciales() {
    this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        map((tareas) =>
          tareas.map(
            (tarea) =>
              ({
                id: tarea.id,
                titulo: tarea.title,
                fechaLimite: new Date(), // La API no proporciona fechaLimite, así que usamos la fecha actual
                completada: tarea.completed,
                personas: [],
              } as Tarea)
          )
        ),
        tap((tareas) => {
          this.tareas = tareas;
          this.listaSignal.set(tareas);
        })
      )
      .subscribe(
        () => console.log('Tareas iniciales cargadas correctamente'),
        (error) => console.error('Error al cargar las tareas iniciales:', error)
      );
  }

  agregarTarea(tarea: Tarea) {
    this.listaSignal.update((val) => [...val, tarea]);
    console.log(this.listaSignal());
  }

  marcarComoCompletada(id: number) {
    const tarea = this.tareas.find((t) => t.id === id);
    if (tarea) {
      this.http
        .patch(`${this.apiUrl}/${id}`, { completed: true })
        .pipe(
          tap(() => {
            tarea.completada = true;
            //   this.actualizarTareas();
          })
        )
        .subscribe();
    }
  }

  agregarHabilidad(tareaId: number, nombrePersona: string, habilidad: string) {
    const tarea = this.tareas.find((t) => t.id === tareaId);
    if (tarea) {
      const persona = tarea.personas.find(
        (p: Persona) => p.nombre === nombrePersona
      );
      if (persona) {
        persona.habilidades.push(habilidad);
        // this.actualizarTareas();
      }
    }
  }

  eliminarHabilidades(
    tareanombre: string,
    personanombre: string,
    habilidadIndex: number
  ) {
    this.listaSignal.update((tareas) =>
      tareas.map((tarea) =>
        tarea.titulo === tareanombre
          ? {
              ...tarea,
              personas: tarea.personas.map((persona) =>
                persona.nombre === personanombre
                  ? {
                      ...persona,
                      habilidades: persona.habilidades.filter(
                        (_, hIndex) => hIndex !== habilidadIndex
                      ),
                    }
                  : persona
              ),
            }
          : tarea
      )
    );
  }

  eliminarPersonas(tareanombre: string, personanombre: string) {
    this.listaSignal.update((tareas) =>
      tareas.map((tarea) =>
        tarea.titulo === tareanombre
          ? {
              ...tarea,
              personas: tarea.personas.filter(
                (p) => p.nombre !== personanombre
              ),
            }
          : tarea
      )
    );
  }
  agregarPersonas(tareaId: number, persona: Persona) {
    console.log('ID de la tarea:', tareaId);
    console.log('Persona a agregar:', persona);

    // Verificar si el nombre ya existe en la lista de personas de la tarea
    const tarea = this.listaSignal().find((t) => t.id === tareaId);
    if (tarea) {
      const nombreExistente = tarea.personas.some(
        (p) => p.nombre === persona.nombre
      );

      if (nombreExistente) {
        this.toastr.error(
          'El nombre ya está en uso en esta tarea. No se puede agregar.'
        ); // Mostrar notificación

        console.log(
          'El nombre ya está en uso en esta tarea. No se puede agregar.'
        );
        return; // Salir del método si el nombre ya existe
      }
    }

    // Si el nombre no existe, proceder a agregar la persona
    this.listaSignal.update((tareas) => {
      return tareas.map((tarea) =>
        tarea.id === tareaId
          ? {
              ...tarea,
              personas: [...(tarea.personas || []), persona], // Asegurarse de que personas sea un array
            }
          : tarea
      );
    });
    this.toastr.success('Agregado correctamente', `${persona.nombre}`);
    console.log('Estado de listaSignal:', this.listaSignal());
    console.log('Tareas completas:', this.tareasCompletasSignal());
    console.log('Tareas incompletas:', this.tareasIncompletasSignal());
  }
}
