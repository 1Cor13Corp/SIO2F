import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudMaterialComponent } from './solicitud-material/solicitud-material.component';
import { CambioContrasenaComponent } from './cambio-contrasena/cambio-contrasena.component';


@NgModule({
  declarations: [
    NavbarComponent,
    SolicitudMaterialComponent,
    CambioContrasenaComponent
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
