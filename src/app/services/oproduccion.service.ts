import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Mensaje } from '../compras/models/modelos-compra';

@Injectable({
  providedIn: 'root'
})
export class OproduccionService {

  public orden!:any
  public mensaje!:Mensaje

  constructor(public socket:WebSocketService) { 
    this.onOrdenPoligrafica()
  }


  onOrdenPoligrafica(){

    this.socket.io.emit('CLIENTE:BuscarOrdenProduccion');

    this.socket.io.on('SERVER:OrdenProduccion', (data) => {
      this.orden = data;
      console.log('Ordenes:',this.orden)
    })

    this.socket.io.on('SERVIDOR:enviaMensaje', (data) => {
      this.mensaje = data
    });

  }

  guardarOrdenProduccion(data){
    this.socket.io.emit('CLIENTE:NuevaOrdenProduccion',data)
  }

  OrdenesPorAsignar(){
    return this.orden.filter(orden => 
      orden.status === 'Por asignar'
    )
  }


}
