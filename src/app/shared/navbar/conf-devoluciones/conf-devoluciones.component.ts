import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DevolucionesService } from 'src/app/services/devoluciones.service';

@Component({
  selector: 'app-conf-devoluciones',
  standalone:false,
  templateUrl: './conf-devoluciones.component.html',
  styleUrls: ['./conf-devoluciones.component.scss']
})
export class ConfDevolucionesComponent {

  public api = inject(DevolucionesService)


  @Input() confirmacion:any;
  @Input() devolucion:any;
  @Output() onCloseModal = new EventEmitter();

  cerrar(){
    this.onCloseModal.emit()
  }

}
