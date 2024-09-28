import { Component, effect } from '@angular/core';
import { Tarea } from 'src/app/model/tarea';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-tareas-lista',
  templateUrl: './tareaslista.component.html',
  styleUrls: ['./tareaslista.component.css'],
})
export class TareasListaComponent {
  filtro: 'todas' | 'completadas' | 'pendientes' = 'todas';
  tareas: Tarea[] = []; // Lista original de tareas
  tareasFiltradas: Tarea[] = []; // Lista filtrada de tareas
  ind: number = 0;
  tareasCompletas: Tarea[] = [];
  tareasIncompletas: Tarea[] = [];
  constructor(private tareasService: TareasService) {
    // Efecto para actualizar la lista de tareas y filtrarlas
    effect(() => {
      this.tareas = this.tareasService.listaSignal(); // Obtener la lista original

      const tareas = this.tareasService.listaSignal();
      if (tareas) {
        this.tareasCompletas = tareas.filter((tarea) => tarea.completada);
        this.tareasIncompletas = tareas.filter((tarea) => !tarea.completada);
        console.log('Tareas completas:', this.tareasCompletas);
        console.log('Tareas incompletas:', this.tareasIncompletas);
      }

      this.filtrarTareas(); // Filtrar tareas al cargar
    });
  }

  cambiarFiltro(filtro: 'todas' | 'completadas' | 'pendientes') {
    this.filtro = filtro;
    this.filtrarTareas(); // Filtrar tareas al cambiar el filtro
  }

  private filtrarTareas() {
    console.log(this.filtro, 'este es');
    switch (this.filtro) {
      case 'completadas':
        this.tareasFiltradas = this.tareasCompletas;
        console.log('estube en bien');
        break;
      case 'pendientes':
        this.tareasFiltradas = this.tareasIncompletas;
        console.log('estube en mal');
        break;
      default:
        this.tareasFiltradas = this.tareas; // Mostrar todas las tareas
    }
  }

  marcarComoCompletada(id: number) {
    this.tareasService.listaSignal.update((tareas) =>
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: true } : tarea
      )
    );
  }
  eliminarHabilidad(
    tareanombre: string,
    personanombre: string,
    habilidadIndex: number
  ) {
    this.tareasService.eliminarHabilidades(
      tareanombre,
      personanombre,
      habilidadIndex
    );
  }

  eliminarPersonas(tareanombre: string, personanombre: string) {
    this.tareasService.eliminarPersonas(tareanombre, personanombre);
  }

  agrega(ind: number) {
    console.log(this.tareas);
    console.log(this.tareasFiltradas);
    this.ind = ind;
  }
}
