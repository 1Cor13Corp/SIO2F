import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent {


  @Input() listado!:boolean;
  @Input() indice:any;
  @Input() item:any;
  @Input() cantidad:any;
  @Input() almacenado:any
  @Input() asignacion:any
  @Input() lotes:any;
  @Input() cantidades:any;
  @Input() sumatoria:any

  @Output() onCloseModal = new EventEmitter()



  cerrar(){
    this.sumatoria = 0
    this.onCloseModal.emit()
  }

  addLote(n: number, cantidad: number, isChecked: any, parcial: boolean) {
    if (isChecked.checked) {
      if (parcial) {
        // Si parcial es true, sumar solo hasta alcanzar this.cantidad
        const faltante = this.cantidad - this.sumatoria;
        
        if (this.sumatoria + Number(cantidad) > this.cantidad) {
          // Si la suma total se pasa de la cantidad, solo sumar lo que falta
          const cantidadASumar = faltante > 0 ? faltante : 0;
          this.sumatoria = this.sumatoria + cantidadASumar;

          this.cantidades[n] = Number(cantidadASumar)
          this.lotes[n] = this.almacenado[n]
        } else {
          // Si no se pasa de la cantidad, sumar la cantidad completa
          this.sumatoria = this.sumatoria + Number(cantidad);
          this.cantidades[n] = Number(cantidad)
          this.lotes[n] = this.almacenado[n]
        }
      } else {
        // Si no es parcial, sumar la cantidad completa
        this.sumatoria = this.sumatoria + Number(cantidad);
        this.cantidades[n] = Number(cantidad)
        this.lotes[n] = this.almacenado[n]
      }
    } else {
      // Si el checkbox no está marcado, restar la cantidad
      this.sumatoria = this.sumatoria - this.cantidades[n];
      this.cantidades[n] = 0;
      this.lotes.splice(n, 1)
    }
  }

  isDisabled(index: number): boolean {
    // Si sumatoria es mayor o igual a la cantidad, y el checkbox no está marcado, deshabilitarlo
    return this.sumatoria >= this.cantidad && (this.cantidades[index] < 1 || this.cantidades[index] == null);
  }


  AsignarMaterial(){
    if(!this.asignacion[this.indice]){
      this.asignacion[this.indice] = []
    }
    this.asignacion[this.indice][this.item] = []

    this.asignacion[this.indice][this.item] = {
      materiales:this.lotes,
      cantidades:this.cantidades
    }

    this.cerrar()

  }




}
