import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { MaquinasService } from 'src/app/services/maquinas.service';
import { OcompraService } from 'src/app/services/ocompra.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OproduccionService } from 'src/app/services/oproduccion.service';
import { ProductosService } from 'src/app/services/productos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-produccion',
  standalone: false,
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent implements OnInit{

  public nueva = false;
  public parametro_busqueda = '';
  public resultados:any = [];
  public productos_selected:any = [];
  public desde = ''
  public hasta = ''

  public anoActual: any;

  public gestiones:boolean = false;
  public orden_selected:any = [];

  public nueva_gestion:boolean = false;

  current: number[] = [0];
  target: number[] = [1000];
  progressPercentage: number[] = [0];

  showPaletteList: boolean = false;
  palettes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  palete_selected: any = [];

  fase_selected = 0

  // Inicializa un array de booleanos para controlar la visibilidad por cada fase y gestión
visibilityFlags: boolean[][] = [];
loading = true;




ngOnInit(): void {
}

// Función para alternar la visibilidad
toggleVisibility(index_fase: number, index_gestion: number) {
    this.visibilityFlags[index_fase][index_gestion] = !this.visibilityFlags[index_fase][index_gestion];
}

  constructor(public api:OproduccionService,
              public clientes:ClientesService,
              public productos:ProductosService
  )
  {
    this.anoActual = new Date().getFullYear();
  }


  buscarSiExisteDefecto(defectos:any, index:any){
    let defecto = defectos.find(x => x.paleta === index);
    if(defecto){
      return {
        existe:true,
        defectos:defecto.defectos
      }
    }else{
      return {
        existe: false,
      }
    }
  }

  formatearHora(fecha24Horas:string){
    // Separa las horas y los minutos
  const [hora, minutos] = fecha24Horas.split(':').map(Number);
  
  // Determina si es AM o PM
  const sufijo = hora >= 12 ? 'p. m.' : 'a. m.';
  
  // Convierte las horas al formato de 12 horas
  const hora12 = hora % 12 || 12;
  
  // Asegúrate de que los minutos siempre tengan dos dígitos
  const minutosFormateados = minutos < 10 ? '0' + minutos : minutos.toString();
  
  // Retorna la hora en formato de 12 horas
  return `${hora12}:${minutosFormateados} ${sufijo}`
  }

  cerrar_nueva_gestion(){
    this.progress();
    this.gestiones = true;
    this.nueva_gestion = false;
  }


  togglePaletteList(index_fase, gestion): void {
    this.palete_selected[index_fase][gestion] = !this.palete_selected[index_fase][gestion]
    this.showPaletteList = !this.showPaletteList
  }

  Gestiones(orden:any){
    this.gestiones = true
    this.orden_selected = JSON.parse(JSON.stringify(orden));
    this.progress()
  }

  progress(){
    this.loading = true
    for (let i = 0; i < this.orden_selected.fases.length; i++) {
      this.visibilityFlags[i] = [];
      this.current[i] = 0;
      if(i === 0){
        this.target[i] = this.orden_selected.cantidad
      }else{
        this.target[i] = this.current[i-1]
      }
      for (let j = 0; j < this.api.GestionesDeFase(this.orden_selected, i).length; j++) {
          // Verifica que this.palete_selected[i] exista
        if (!this.palete_selected[i]) {
            this.palete_selected[i] = [];
        }

        // Verifica que this.palete_selected[i][j] exista
        if (!this.palete_selected[i][j]) {
            this.palete_selected[i][j] = false;
        }
        this.visibilityFlags[i][j] = true; // Inicialmente, muestra todos los elementos
        this.current[i] += Number(this.api.GestionesDeFase(this.orden_selected, i)[j].productos);
        this.progressPercentage[i] = (this.current[i] * 100) / this.target[i]
      }

      if(i === this.orden_selected.fases.length -1){
        this.loading = false;
      }
    }
  }

  filtrarResultados(valor: any) {
    this.resultados = this.api.orden.filter(item =>
      item.numero_op.includes(valor.value)
    );
  }

  filtrarResultadosOC(valor: any) {
    this.resultados = this.api.orden.filter(item =>
      item.oc.orden.includes(valor.value)
    );
  }

  filtrarResultadosCliente(valor: any) {
    this.resultados = this.api.orden.filter(item =>
      item.cliente._id.includes(valor.value)
    );
  }

  filtrarResultadosProducto(valor:any) {
    this.resultados = this.api.orden.filter(item =>
      item.producto[0]._id.includes(valor.value)
    );
  }

  BuscarPorFecha(){
    const desde_ = new Date(this.desde);
    const hasta_ = new Date(this.hasta);

    this.resultados = this.api.orden.filter(item => {
      const fechaItem = new Date(item.createdAt);
      return fechaItem >= desde_ && fechaItem <= hasta_;
    });
  }
  

  BuscarProductos(event:any){
    this.productos_selected = this.productos.buscarPorClientes(event.value);
  }


}
