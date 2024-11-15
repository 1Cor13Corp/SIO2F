import { Component } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { MaquinasService } from 'src/app/services/maquinas.service';
import { OcompraService } from 'src/app/services/ocompra.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OproduccionService } from 'src/app/services/oproduccion.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent {

  public nueva = false;
  public parametro_busqueda = '';
  public resultados:any = [];
  public productos_selected:any = [];
  public desde = ''
  public hasta = ''

  public anoActual: any;



  constructor(public api:OproduccionService,
              public clientes:ClientesService,
              public productos:ProductosService
  )
  {
    this.anoActual = new Date().getFullYear();
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
