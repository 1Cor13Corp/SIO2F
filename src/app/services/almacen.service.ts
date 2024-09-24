import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  Almacen:any;
  constructor(private socket:WebSocketService) {
    this.BuscarAlmacen();
   }


  BuscarAlmacen() {
    this.socket.io.on('SERVER:almacen', async (Almacen) => {
      this.Almacen = Almacen;
      console.log(this.Almacen)
    })

    this.socket.io.emit('CLIENTE:BuscarAlmacen');
  }

  GuardarAlmacen(data:any){
    this.socket.io.emit('CLIENTE:NuevoAlmacen', data)
  }

  BuscarPorGrupo(grupo:string){
    return this.Almacen.filter((x:any)=> x.material.grupo === grupo)
  }

  buscarPorLote(lote:any){
    return this.Almacen.some((x) => x.lote === lote);
  }
}
