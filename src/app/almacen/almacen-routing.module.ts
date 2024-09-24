import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmacenComponent } from './almacen.component';
import { RouterModule, Routes } from '@angular/router';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { AlmacenadoComponent } from './almacenado/almacenado.component';

const routes: Routes =[
  {
    path:'',
    component:AlmacenComponent,
    children:[
      {
        path:'recepcion',
        component:RecepcionComponent
      },
      {
        path:'inventario',
        component:AlmacenadoComponent
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
export class AlmacenRoutingModule { }
