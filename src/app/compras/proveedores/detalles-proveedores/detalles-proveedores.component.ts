import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detalles-proveedores',
  templateUrl: './detalles-proveedores.component.html',
  styleUrls: ['./detalles-proveedores.component.scss']
})
export class DetallesProveedoresComponent {

  @Input() proveedor:any;
  @Input() detalle!:boolean;
  @Output() onCloseModal = new EventEmitter();
  
  constructor() { }

  cerrar(){
    this.onCloseModal.emit();
  }
 
}
