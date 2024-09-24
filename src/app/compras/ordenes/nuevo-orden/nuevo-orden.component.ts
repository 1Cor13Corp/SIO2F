import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FabricantesService } from 'src/app/services/fabricantes.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { OpoligraficaService } from 'src/app/services/opoligrafica.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-orden',
  templateUrl: './nuevo-orden.component.html',
  styleUrls: ['./nuevo-orden.component.scss']
})
export class NuevoOrdenComponent {

  constructor(public proveedores:ProveedoresService,
              public fabricantes:FabricantesService,
              public materiales:MaterialesService,
              public api:OpoligraficaService
            ){

  }

  @Input() nueva:any;
  @Input() Orden:any;
  @Output() onCloseModal = new EventEmitter();
  @Output() onChangeProv = new EventEmitter();

  public fabricantesIDs
  public proveedor = ''
  public material__ = ''
  public loading = false;

  proveedores_(e){
    this.onChangeProv.emit()
    setTimeout(() => {
      this.Orden.proveedor = this.proveedores.proveedores[e.value]._id;
      this.fabricantesIDs = this.proveedores.proveedores[e.value].fabricantes.map(fabricante => fabricante._id);
    }, 500);
  }

  llenarMaterial(e){
    let material_nombre = e.value.split('&')
    this.material.material = material_nombre[0];
    this.material.nombre = material_nombre[1]
  }

  addMaterial(){
    this.Orden.pedido.push(this.material)
    this.material = {
      nombre:'',
      material:'',
      precio:'',
      cantidad:'',
      unidad:''
    }
    this.material__ = ''
  }

  material = {
    nombre:'',
    material:'',
    precio:'',
    cantidad:'',
    unidad:''
  }

  guardar(){
    this.loading = true;
    this.api.nuevaOrden(this.Orden)
    setTimeout(() => {
      Swal.fire({
        icon:this.api.mensaje.icon,
        text:this.api.mensaje.mensaje,
        timer:5000,
        timerProgressBar:true,
        position:'top-end',
        toast:true,
        showConfirmButton:false
      })
      this.loading = false;
      this.onCloseModal.emit()
    }, 2000);
  }

  borrar(n){
    this.Orden.pedido.splice(n,1)
  }
  
  Number_(n){
    return Number(n);
  }

  getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calcularTotalIva(orden) {
    return orden.pedido.reduce((total, material) => {
      return total + (orden.iva / 100) * material.precio * material.cantidad;
    }, 0);
  }
  
  calcularTotalNeto(orden) {
    return orden.pedido.reduce((total, material) => {
      return total + material.precio * material.cantidad;
    }, 0);
  }

}


