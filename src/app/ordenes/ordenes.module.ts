import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrdenesRoutingModule } from './ordenes-routing.module';
import { CompraComponent } from './compra/compra.component';
import { NuevaOrdenComponent } from './compra/nueva-orden/nueva-orden.component';
import { NavbarModule } from '../shared/navbar/navbar.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProduccionComponent } from './produccion/produccion.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NuevaOPComponent } from './produccion/nueva-op/nueva-op.component';
import { ResizableModule } from 'angular-resizable-element';
import { ClientesComponent } from './clientes/clientes.component';
import { NewClienteComponent } from './clientes/new-cliente/new-cliente.component';
import { NuevaGestionComponent } from './nueva-gestion/nueva-gestion.component';
import { PlanificacionComponent } from './produccion/planificacion/planificacion.component';
import { DevolucionesComponent } from './produccion/devoluciones/devoluciones.component';
import { ComentariosComponent } from '../almacen/recepcion/comentarios/comentarios.component';
import { AlmacenModule } from '../almacen/almacen.module';



@NgModule({
  declarations: [
    CompraComponent,
    NuevaOrdenComponent,
    ProduccionComponent,
    NuevaOPComponent,
    ClientesComponent,
    NewClienteComponent,
    NuevaGestionComponent,
    PlanificacionComponent,
    DevolucionesComponent
  ],
  imports: [
    CommonModule,
    OrdenesRoutingModule,
    NavbarModule,
    RouterModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    ResizableModule,
    AlmacenModule,
    ReactiveFormsModule
  ]
})
export class OrdenesModule { }
