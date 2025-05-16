import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Mensaje } from '../compras/models/modelos-compra';

@Injectable({
  providedIn: 'root'
})
export class BobinasService {
  
  public convertidora!:any;
  public bobinas!:any;
  public mensaje!:Mensaje

  constructor(private socket:WebSocketService) { 

    this.buscarConvertidora();
  }


  buscarConvertidora(){
    this.socket.io.emit('CLIENTE:BuscarConvertidora')

    this.socket.io.on('SERVER:Convertidora', (data)=>{
      this.convertidora = data;
      console.log(this.convertidora)
    })

    this.socket.io.emit('CLIENTE:BuscarBobinas')

    this.socket.io.on('SERVER:Bobinas', (data)=>{
      this.bobinas = data;
    })

    this.socket.io.on('SERVER:Convertidora', (data)=>{
      this.convertidora = data;
      console.log(this.convertidora)
    })

    this.socket.io.on('SERVIDOR:enviaMensaje', (data) => {
      this.mensaje = data
    });
  }

  guardarConvertidora(data:any){
    this.socket.io.emit('CLIENTE:NuevaConvertidora', data)
  }

  guardarBobina(data:any){
    this.socket.io.emit('CLIENTE:NuevaBobina', data)
  }

  bobinaPorConvertidora(conv:any){
    return this.bobinas.filter((b:any) => b.convertidora === conv)
  }

}
