import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudMaterialComponent } from './solicitud-material/solicitud-material.component';
import { CambioContrasenaComponent } from './cambio-contrasena/cambio-contrasena.component';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { ControlComponent } from './asignacion/control/control.component';
import { ColorMixComponent } from './solicitud-material/color-mix/color-mix.component';


@NgModule({
  declarations: [
    NavbarComponent,
    SolicitudMaterialComponent,
    CambioContrasenaComponent,
    AsignacionComponent,
    ControlComponent,
    ColorMixComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[NavbarComponent]
})
export class NavbarModule { }
