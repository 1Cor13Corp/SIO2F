import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { multiply } from 'lodash';
import { DefectosService } from 'src/app/services/defectos.service';
import { LoginService } from 'src/app/services/login.service';
import { OproduccionService } from 'src/app/services/oproduccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-gestion',
  standalone: false,
  templateUrl: './nueva-gestion.component.html',
  styleUrls: ['./nueva-gestion.component.scss']
})
export class NuevaGestionComponent {

  @Input() gestion:any;
  @Input() orden:any;
  @Input() fase:any;
  @Output() onCloseModal = new EventEmitter();

  public api = inject(OproduccionService)
  public login = inject(LoginService)
  public defectos = inject(DefectosService)

  public tipo = '';
  public hojas:boolean = true
  public productos:boolean = true
  paletas = 0;

  p_yellow = 3
  p_selected

  public data = {
    orden:'',
    fase:0,
    usuario:'',
    fecha:'',
    inicio:'',
    fin:'',
    hojas:0,
    productos:0,
    paletas:0,
    team:'',
    defectos:[{paleta:0,defectos:[]}],
    observaciones:''
  }

  public add_defecto:boolean = false;
  public defectos_:any = []

  defectos_agregados:any = []

  GuardarDefectos(){
    this.data.defectos.push({
      paleta:this.p_selected,
      defectos:this.defectos_agregados
    })

    this.defectos_agregados = []
    this.defectos_ = []
    this.gestion = true;
    this.add_defecto = false;
  }

  FindDefecto(paleta: number) {
    let verificacion = this.data.defectos.find(x => x.paleta === paleta);

    if (verificacion) {
      return {
        amarillo:true,
        defectos:verificacion.defectos
      };
    } else {
      return {
        amarillo:false
      }
    }
  }

  CalcularProductos(e:any){
    this.data.productos = e.value * this.orden.ejemplares
  }

  CalcularHojas(e:any){
    this.data.hojas = e.value / this.orden.ejemplares
  }
  

  agregarDefecto(e: any) {
    // Verifica si el defecto ya está en el array
    let agregado = this.defectos_agregados.some(defecto => defecto === e.value);
  
    // Si no está agregado, añádelo
    if (!agregado) {
      this.defectos_agregados.push(e.value);
    }
  }
  

  GuardarData = async()=>{
    this.data.orden = this.orden._id;
    this.data.fase = this.fase;
    this.data.usuario = `${this.login.usuario.Nombre} ${this.login.usuario.Apellido}`;
    this.api.NuevaGestion(this.data)
    this.data = {
      orden:'',
      fase:0,
      usuario:'',
      fecha:'',
      inicio:'',
      fin:'',
      hojas:0,
      productos:0,
      paletas:0,
      team:'',
      defectos:[{paleta:0,defectos:[]}],
      observaciones:''
    }

    this.onCloseModal.emit();
    setTimeout(() => {
      Swal.fire({
        text:this.api.mensaje.mensaje,
        icon:this.api.mensaje.icon,
        timer:1500,
        showConfirmButton:false,
        toast:true,
        position:'top-end',
        timerProgressBar:true
      })
    }, 1000);
  }


  cerrar(){
    this.onCloseModal.emit();
  }

  SeleccionarPaleta(n){
    this.p_selected = n;
  }

  seleccionarTipo(tipo:any){
    if(tipo.value === 'Hojas'){
      this.hojas = false;
      this.productos = true;
    }else{
      this.productos = false;
      this.hojas = true;
    }
  }


  addNew = async()=>{


    const defecto_ = this.defectos.buscarPorClienteYCategoria(this.orden.cliente._id, this.orden.producto[0].identificacion.categoria)


    console.log(defecto_)

    let data = {
      menores:{},
      mayores:{}
    }

    for(let i = 0; i < defecto_.defectos.menores.defectos.length; i++){
      this.defectos_.push(defecto_.defectos.menores.defectos[i])
    }

    for(let i = 0; i < defecto_.defectos.mayores.defectos.length; i++){
      this.defectos_.push(defecto_.defectos.mayores.defectos[i])
    }

    this.add_defecto = true;
    this.gestion = false;

  //   const { value: fruit } = await Swal.fire({
  //     title: "Selecciona los defectos",
  //     input: "select",
  //     inputOptions: data,
  //     inputPlaceholder: "Seleccione los defectos encontrados",
  //     showCancelButton: true,
  //     html: `
  //   You can use <b>bold text</b>,
  //   <a href="#" autofocus>links</a>,
  //   and other HTML tags
  // `,
  //     inputValidator: (value) => {
  //       return new Promise((resolve) => {
  //         if (value === "Defecto Mayor 1") {
  //           resolve();
  //         } else {
  //           resolve("You need to select oranges :)");
  //         }
  //       });
  //     }
  //   });
  //   if (fruit) {
  //     Swal.fire(`You selected: ${fruit}`);
  //   }
    



  }

}
