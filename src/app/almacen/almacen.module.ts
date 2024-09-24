import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmacenComponent } from './almacen.component';
import { AlmacenRoutingModule } from './almacen-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarModule } from '../shared/navbar/navbar.module';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { NuevaRecepcionComponent } from './recepcion/nueva-recepcion/nueva-recepcion.component';
import { ListadoComponent } from './recepcion/listado/listado.component';
import { CondicionComponent } from './recepcion/condicion/condicion.component';
import { DetallesRecepcionComponent } from './recepcion/detalles-recepcion/detalles-recepcion.component';
import { EdicionRecepcionComponent } from './recepcion/edicion-recepcion/edicion-recepcion.component';
import { AlmacenadoComponent } from './almacenado/almacenado.component';
import { InventarioComponent } from './almacenado/inventario/inventario.component';
import { ComentariosComponent } from './recepcion/comentarios/comentarios.component';
import { InventariosComponent } from './almacenado/inventarios/inventarios.component';



@NgModule({
  declarations: [
    AlmacenComponent,
    RecepcionComponent,
    NuevaRecepcionComponent,
    ListadoComponent,
    CondicionComponent,
    DetallesRecepcionComponent,
    EdicionRecepcionComponent,
    AlmacenadoComponent,
    InventarioComponent,
    ComentariosComponent,
    InventariosComponent
  ],
  imports: [
    CommonModule,
    AlmacenRoutingModule,
    NavbarModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AlmacenModule { }
