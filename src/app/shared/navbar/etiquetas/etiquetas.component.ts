import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-etiquetas',
  standalone: false,templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.scss']
})
export class EtiquetasComponent {

  @Input() Etiquetas:any;
  @Output() onCloseModal = new EventEmitter()

  cerrar(){
    this.onCloseModal.emit();
  }

}
