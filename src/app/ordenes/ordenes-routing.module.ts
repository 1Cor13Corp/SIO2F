import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdenesComponent } from './ordenes.component';
import { CompraComponent } from './compra/compra.component';
import { ProduccionComponent } from './produccion/produccion.component';
import { ClientesComponent } from './clientes/clientes.component';
import { PlanificacionComponent } from './produccion/planificacion/planificacion.component';

const routes: Routes =[
  {
    path:'',
    component:OrdenesComponent,
    children:[
      {
        path:'compra',
        component:CompraComponent
      },
      {
        path:'produccion',
        component:ProduccionComponent
      },
      {
        path:'clientes',
        component:ClientesComponent
      },
      {
        path:'planificacion',
        component:PlanificacionComponent
      }
    ]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrdenesRoutingModule { }
