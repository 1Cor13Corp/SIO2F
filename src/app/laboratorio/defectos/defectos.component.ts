import { Component } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DefectosService } from 'src/app/services/defectos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-defectos',
  templateUrl: './defectos.component.html',
  styleUrls: ['./defectos.component.scss']
})
export class DefectosComponent {


  constructor(public clientes:ClientesService,
              public categorias:CategoriasService,
              public api:DefectosService){

  }

  public valor = 0

  public Tags = [true, false, false];
  public defecto = ''

  public cliente_ = '';
  public categoria_ = '';
  public aqls = [0,0,0]
  public defectos ={
    menores : [],
    mayores : [],
    criticos: []
  }

  public tipo = ''
  public n = 0
  public edicion = false;

  public edicion_general = false;

  GuardandoCambios(e){
    if(this.Tags[0]){
      this.aqls[0] = e.value
    }else if(this.Tags[1]){
      this.aqls[1] = e.value
    }else{
      this.aqls[2] = e.value
    }
  }

  habilitarEdicion(){
    this.edicion_general = true;
    this.Tags = [true, false, false];
    this.valor = this.aqls[0]
  }

  seleccionTag(n){
    this.Tags = [false, false, false];
    this.Tags[n] = true;
    this.valor = this.aqls[n]
    // for(let i=0; i<this.aqls[n];i=i+0.01){
    //   this.valor = i;
    //   console.log(i)
    // }
  }

  editar(n, tipo){
    this.edicion = true;
    this.n = n;
    this.tipo = tipo;
    this.valor = this.aqls[0]
  }

  clases:boolean[] = []
  deleteDefecto(tipo, i){
    this.clases[i] = true
    setTimeout(() => {
      this.defectos[tipo].splice(i,1);
      this.clases = []
    }, 500);
  }

  onEnterPress(){
    if(!this.defecto){
      return
    }
    let tipo = ''
    if(this.Tags[0]){
      tipo = 'menores'
    }else if(this.Tags[1]){
      tipo = 'mayores'
    }else{
      tipo = 'criticos'
    }
    this.agregarDefecto(tipo)
    this.defecto = ''
  }

  agregarDefecto(tipo){
    this.defectos[tipo].push(this.defecto);
    this.defecto = '';
  }

  guardarCambios(){
    let data = {
      cliente  : this.cliente_,
      categoria: this.categoria_,
      defectos : {
        menores : {
          defectos : this.defectos.menores,
          aql      : this.aqls[0]
        },
        mayores : {
          defectos : this.defectos.mayores,
          aql      : this.aqls[1]
        },
        criticos: {
          defectos : this.defectos.criticos,
          aql      : this.aqls[2]
        }
      }
    }

    this.api.guardarDefecto(data);
    setTimeout(() => {
      Swal.fire({
        toast:true,
        showConfirmButton:false,
        position:'top-end',
        icon:this.api.mensaje.icon,
        text:this.api.mensaje.mensaje,
        timer:5000,
        timerProgressBar:true
      })
    }, 1000);
  }

  BuscarDefectosAlmacenados(){
    let resultado = this.api.buscarPorClienteYCategoria(this.cliente_, this.categoria_)
    if(!resultado){
      this.edicion_general = true;
    }else{
      this.defectos.menores = resultado.defectos.menores.defectos;
      this.defectos.mayores = resultado.defectos.mayores.defectos;
      this.defectos.criticos = resultado.defectos.criticos.defectos;
      this.aqls[0] = resultado.defectos.menores.aql
      this.aqls[1] = resultado.defectos.mayores.aql
      this.aqls[2] = resultado.defectos.criticos.aql
      this.edicion_general = false;
    }
  }



}
