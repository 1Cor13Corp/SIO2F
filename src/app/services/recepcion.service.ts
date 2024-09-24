import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Mensaje } from '../compras/models/modelos-compra';
import * as moment from 'moment';
import { AnalisisComponent } from '../laboratorio/analisis/analisis.component';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  public mensaje!: Mensaje;
  public recepciones: any;
  public comentarios: any;
  public topFive = []
  constructor(public socket: WebSocketService) {
    this.BuscarRecepciones();
    this.BuscarComentarios();
  }



  buscarTop5(){
    if(this.recepciones){
      this.socket.io.on('SERVER:TopFive', (data) => {
        console.log(data)
        data.forEach((analisis, index)=>{
          this.recepciones.forEach((recepcion, indieRecepcion)=>{
              recepcion.materiales.forEach((materiales, indiceMateriales)=>{
                if(materiales[0].analisis === data._id){
                  console.log('done')
                }
              })
          })
        })
      })
    }
  }


  BuscarComentarios() {

    this.socket.io.on('SERVER:Comentario', (data) =>{
      this.comentarios = data
    });

    this.socket.io.emit('CLIENTE:Comentario');

  }

  guardarComentarios(data){
    this.socket.io.emit('CLIENTE:NuevoComentario', data);
  }

  BuscarRecepciones() {
  

    this.socket.io.on('SERVIDOR:enviaMensaje', (data) => {
      this.mensaje = data
    });

    this.socket.io.emit('CLIENTE:BuscarRecepciones')

    this.socket.io.on('SERVER:Recepciones', (Recepciones) => {
      this.recepciones = Recepciones
      console.log(this.recepciones)
    })
      this.buscarTop5();
  }

  GuardarRecepcion(data: any) {
    this.socket.io.emit('CLIENTE:NuevaRecepcion', data)
  }

  NoticarRecepcion(id: string) {
    this.socket.io.emit('CLIENTE:NotificaNuevoMaterial', id);
    console.log(id);
  }

  checkearRecepcion(id: string) {
    this.socket.io.emit('CLIENTE:CheckeoDeMaterial', id);
  }


filtrarMaterialesPorGrupoYAnalisis(nombreGrupo: string, materia?: any) {
    console.log(materia)
    let materialesFiltrados: any[] = [];
    let materialesSet = new Set(); // Utilizar un Set para mantener los materiales únicos
    this.recepciones.forEach((recepcion) => {
        recepcion.materiales.forEach((grupoMateriales) => {
            grupoMateriales.forEach((material) => {
                if (material.material.grupo._id === nombreGrupo && material.analisis && (!materia || material.material._id === materia)) {
                    const materialKey = material.material._id; // Utilizar el _id del material como clave
                    if (!materialesSet.has(materialKey)) { // Verificar si el material ya existe en el Set
                        materialesFiltrados.push({
                            material: material,
                            Recepcion: recepcion
                        });
                        materialesSet.add(materialKey); // Agregar el _id del material al Set
                    }
                }
            });
        });
    });
    return materialesFiltrados;
}

filtrarMaterialesPorLoteYAnalisis(nombreLote: string, materia?: any) {
  console.log(nombreLote)
  let materialesFiltrados: any[] = [];
  let materialesSet = new Set(); // Utilizar un Set para mantener los materiales únicos
  this.recepciones.forEach((recepcion) => {
      recepcion.materiales.forEach((grupoMateriales) => {
          grupoMateriales.forEach((material) => {
              if (material.lote === nombreLote && material.analisis) {
                  const materialKey = material.material._id; // Utilizar el _id del material como clave
                  if (!materialesSet.has(materialKey)) { // Verificar si el material ya existe en el Set
                      materialesFiltrados.push({
                          material: material,
                          Recepcion: recepcion
                      });
                      materialesSet.add(materialKey); // Agregar el _id del material al Set
                  }
              }
          });
      });
  });
  return materialesFiltrados;
}

filtrarMaterialesPorfechaYAnalisis(nombreLote: string, materia?: any) {
  console.log(nombreLote)
  let materialesFiltrados: any[] = [];
  let materialesSet = new Set(); // Utilizar un Set para mantener los materiales únicos
  this.recepciones.forEach((recepcion) => {
      recepcion.materiales.forEach((grupoMateriales) => {
          grupoMateriales.forEach((material) => {
              if (material.lote === nombreLote && material.analisis) {
                  const materialKey = material.material._id; // Utilizar el _id del material como clave
                  if (!materialesSet.has(materialKey)) { // Verificar si el material ya existe en el Set
                      materialesFiltrados.push({
                          material: material,
                          Recepcion: recepcion
                      });
                      materialesSet.add(materialKey); // Agregar el _id del material al Set
                  }
              }
          });
      });
  });
  return materialesFiltrados;
}

filtrarMaterialesporFecha(desde, hasta){
  let materialesFiltrados: any[] = [];
  let materialesSet = new Set(); // Utilizar un Set para mantener los materiales únicos
  this.recepciones.forEach((recepcion) => {
    const fecha_moment = moment(recepcion.createdAt).format('yyyy-MM-DD');
    const fecha = Date.parse(fecha_moment);
    if(fecha >= desde && fecha <= hasta){
      recepcion.materiales.forEach((grupoMateriales) => {
        grupoMateriales.forEach((material) => {
            if (material.analisis) {
                const materialKey = material.material._id; // Utilizar el _id del material como clave
                if (!materialesSet.has(materialKey)) { // Verificar si el material ya existe en el Set
                    materialesFiltrados.push({
                        material: material,
                        Recepcion: recepcion
                    });
                    materialesSet.add(materialKey); // Agregar el _id del material al Set
                }
            }
        });
    });
    }
  })
  return materialesFiltrados;
}

}
