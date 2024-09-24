import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-solicitud-material',
  templateUrl: './solicitud-material.component.html',
  styleUrls: ['./solicitud-material.component.scss']
})
export class SolicitudMaterialComponent implements OnInit{


  ngOnInit(): void {
  }

  @Input() Solicitud_Material:any
  @Output() onCloseModal = new EventEmitter();

  public secciones:boolean[] = []

  public otro = false;
  material = ''
  grupo = ''


  ver(){
    this.grupo
  }

  otros(){
    if(this.otro){
      this.otro = false,
      this.material = ''
      this.grupo = ''
    }else{
      this.otro = true
    }
  }

  cerrar(){
    this.secciones = []
    this.onCloseModal.emit();
  }

  seccion(n){
    this.secciones = []
    this.secciones[n] = true;
  }

  home(){
    this.secciones = []
  }


  public textoSinFormato: string = '';



  keyDownEvent(e: KeyboardEvent): boolean {
    // Permitir la tecla para borrar
    if (e.key === 'Backspace') return true;
    // Permitir flecha izquierda
    if (e.key === 'ArrowLeft') return true;
    // Permitir flecha derecha
    if (e.key === 'ArrowRight') return true;
    // Bloquear tecla de espacio
    if (e.key === ' ') return false;
    // Bloquear tecla si no es un número o una coma
    if (isNaN(Number(e.key))) return false;
    return true;
}

keyUpEvent(numeros: HTMLInputElement): void {
    numeros.value = numeros.value
        // Borrar todos los espacios en blanco
        .replace(/\s/g, '');
    // Guardar el texto sin formato en la variable textoSinFormato
    this.textoSinFormato = numeros.value;
    numeros.value = numeros.value
        // Agregar un espacio cada dos números
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        // Borrar espacio al final
        .trim();
}


public motivos:any = []

public motivo_escrito = `` 
motivo(n:number, value:any){
  this.motivos[n] = {
    motivo:value.value
  };

  this.motivo_escrito = `
  Solicitud para orden 2024000
`
  
  for(let i=0;i<this.motivo.length;i++){
    if(this.motivos[i]){
      this.motivo_escrito = this.motivo_escrito + `#Azul Proceso Apache (olin) por ${this.motivos[i].motivo}
`
    }
  }
}


inputValue: string = '0,00';

  onInputChange(event: any) {
    let newValue = event.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    if (newValue.charAt(0) === '0' && newValue.charAt(1) !== '.') {
      newValue = newValue.slice(1);
    }
    if (newValue.length > 2) {
      let format = newValue.slice('0', -2)
      format = format.replace(/\D/g, '')
      format = format.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      console.log(format)
      newValue = format + ',' + newValue.slice(-2); // Agregar el punto decimal
    } else if (newValue.length === 2) {
      newValue = '0,' + newValue; // Agregar el punto decimal al inicio si solo hay 2 dígitos
    } else {
      newValue = '0,0' + newValue; // Agregar ceros adicionales si solo hay 1 dígito
    }
    this.inputValue = newValue;
  }




}
