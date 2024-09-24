import { Component } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { MaquinasService } from 'src/app/services/maquinas.service';
import { OcompraService } from 'src/app/services/ocompra.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent {

  public OP ={
    cliente: '',
    oc:''
  }

  public Ordenes:any
  public productos:any
  public paletaVinotinto = [
    "#ffe4e1", // Rosa pastel
  "#d8f8e1", // Verde menta
  "#fcb7af", // Melocotón suave
  "#b0f2c2", // Azul cielo
  "#b0c2f2", // Lila delicado
  "#fabfb7", // Rosa empolvado
  "#fdf9c4", // Amarillo pálido
  "#c5c6c8", // Gris perla
  "#b2e2f2", // Azul celeste
  "#ddcdce"  // Beige suave
  ];

  public Trabajos:any;

  constructor(public clientes:ClientesService,
              public oc:OcompraService,
              public maquinas:MaquinasService
  ){}

  public colorIndex = 0;

getColor(index: number): string {
  const color = this.paletaVinotinto[this.colorIndex % this.paletaVinotinto.length];
  this.colorIndex++;
  return color;
}

  findOC(){
    this.Ordenes = this.oc.buscarPorCliente(this.OP.cliente);
  }

  findProducts(){
    let orden = this.Ordenes.find((x:any)=> x._id === this.OP.oc)
    this.productos = orden.pedido;
  }

  maquinasOrigen:any = this.maquinas.maquinas;
  maquinasDestino:any = [];

  onDrop(event: CdkDragDrop<string[]>){
    if (event.previousContainer === event.container) {
      // Mover dentro del mismo arreglo
      moveItemInArray(this.maquinasDestino, event.previousIndex, event.currentIndex);
    } else {
      // Mover entre arreglos
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  faseEliminada:any =  {}
  maquina:any = [];
  fase:any =[]

  eliminarFase(maquinaIndex: number, faseIndex: number): void {
  if (!this.maquinasDestino[maquinaIndex].fases[faseIndex].borrado) {
    this.maquinasDestino[maquinaIndex].fases[faseIndex].borrado = true;
  } else {
    this.maquinasDestino[maquinaIndex].fases[faseIndex].borrado = false;
  }

  // Verificar si todas las fases están marcadas como borradas
  const todasFasesBorradas = this.maquinasDestino[maquinaIndex].fases.every(fase => fase.borrado);

  // Si todas las fases están borradas, establecer la primera fase como no borrada
  if (todasFasesBorradas) {
    this.maquinasDestino[maquinaIndex].fases[0].borrado = false;
  }
}

}
