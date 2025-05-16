import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BobinasService } from 'src/app/services/bobinas.service';
import { MaterialesService } from 'src/app/services/materiales.service';

@Component({
  selector: 'app-new-bobina',
  templateUrl: './new-bobina.component.html',
  styleUrls: ['./new-bobina.component.scss']
})
export class NewBobinaComponent {


  constructor(public api:BobinasService,
              public materiales:MaterialesService
  ){

  }


  @Input() nueva:any;
  @Output() onCloseModal = new EventEmitter()

  public sustrato
  public ancho = 0
  public largo = 0
  public hojas = 0
  public peso = 0

  cerrar(){
    this.onCloseModal.emit();
  }

  guardarData(){

  }


  buscarSustratosDeBobinas(){
    const idsMaterialesUsados = [...new Set(this.api.bobinas.map(b => b.material._id))];
    const materialesFiltrados = this.materiales.materiales.filter(m => idsMaterialesUsados.includes(m._id));
    return materialesFiltrados
  }

  buscarAnchos(){
    return [...new Set(this.api.bobinas.map(b => b.ancho))];
  }

  calcularToneladas(){

    let gramaje = this.materiales.materiales.find((m:any) => m._id === this.sustrato).gramaje

    const pesoKg = (gramaje * (this.ancho / 100) * (this.largo / 100) * this.hojas) / 1000;
    this.peso = Number((pesoKg / 1000).toFixed(2));
  }

  calcularWidth(){
    return (this.largo * 300) / 70;
  }

  calcularHojasDesdeToneladas() {
  const gramaje = this.materiales.materiales.find((m: any) => m._id === this.sustrato).gramaje;

  const anchoM = this.ancho / 100;
  const largoM = this.largo / 100;

  const hojas = (this.peso * 1_000_000) / (gramaje * anchoM * largoM);
  this.hojas = Math.floor(hojas); // redondear hacia abajo a entero
  }

  ConversionMaterial(){
    
  }

}
