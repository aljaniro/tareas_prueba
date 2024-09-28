import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasComponent } from './component/tareas/tareas.component';
import { PersonasComponent } from './component/personas/personas.component';
import { TareasListaComponent } from './pages/tareaslista/tareaslista.component';


const routes: Routes = [
  { path: 'tareas', component: TareasComponent },
  { path: 'personas', component: PersonasComponent },
  { path: 'lista', component: TareasListaComponent },
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
  { path: '**', redirectTo: '/lista' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
