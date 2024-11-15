import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlmacenService } from 'src/app/services/almacen.service';
import { FormulasService } from 'src/app/services/formulas.service';
import { MaterialesService } from 'src/app/services/materiales.service';

@Component({
  selector: 'app-color-mix',
  templateUrl: './color-mix.component.html',
  styleUrls: ['./color-mix.component.scss']
})
export class ColorMixComponent implements OnInit{

  constructor(public materiales:MaterialesService,
              public formulas:FormulasService,
              public almacen:AlmacenService
  ){}

  ngOnInit(): void {
    this.envasesInventario = this.almacen.BuscarEnvasesCapacidadyCantidad()
  }


  @Output() onCloseModal = new EventEmitter();

  public formulas_:any = []
  public _seBusco = false;
  public name = ''
  public formular:any = []
  public preparacion:any = ''
  public cantidad_a_preparar = 1;
  public envasesInventario:any;


  MostrarInfo(pantone, name ){
    this._seBusco = false
    this.name = name
    this.formulas_ = pantone
    this.formulas_ = this.formulas.BuscarFormulas(pantone)
    this.preparacion = pantone
    setTimeout(() => {
      this._seBusco = true
    }, 1000);
  }


  home(){
    this.onCloseModal.emit();
  }

  
  
  seleccionarEnvases(kgPreparar: number): { capacidad: number, cantidad: number }[] { 
    
    const capacidadesDisponibles = [...this.envasesInventario]
    const sortedEnvases = capacidadesDisponibles.sort((a, b) => b.capacidad - a.capacidad); 
    let kgRestante = kgPreparar; 
    const envasesSeleccionados:any = []; 
      for (const envase of sortedEnvases) { 
        if (kgRestante <= 0) break; 
        const envasesNecesarios = Math.floor(kgRestante / envase.capacidad); 
        const envasesTomados = Math.min(envasesNecesarios, envase.cantidad); 
        if (envasesTomados > 0) { 
          
          // Verificar si ya existe un envase de la misma capacidad en el array seleccionado 
          const existente = envasesSeleccionados.find(e => e.capacidad === envase.capacidad); 
            if (existente) { 
              existente.cantidad += envasesTomados; 
            } else { 
              envasesSeleccionados.push({ capacidad: envase.capacidad, cantidad: envasesTomados });
            } 
            kgRestante -= envase.capacidad * envasesTomados;
           } 
          } 
          
          if (kgRestante > 0) { 
            for (const envase of sortedEnvases.reverse()) { 
              if (kgRestante <= 0) break; 
                if (envase.cantidad > 0 && envase.capacidad >= kgRestante) { 
                  envasesSeleccionados.push({ 
                    capacidad: envase.capacidad, cantidad: 1 }); 
                  
                kgRestante = 0; 
              } 
            } 
          } 
          
        return this.combinarEnvases(envasesSeleccionados); 
    }

    combinarEnvases = (envases) => { 
      const resultado:any = []; 
      const mapaEnvases = new Map(); 
        envases.forEach((envase) => { 
          if (mapaEnvases.has(envase.capacidad)) { 
              mapaEnvases.set(envase.capacidad, mapaEnvases.get(envase.capacidad) + envase.cantidad);
          } else { 
            mapaEnvases.set(envase.capacidad, envase.cantidad); 
          } 
        }); 
        mapaEnvases.forEach((cantidad, capacidad) => { 
          resultado.push({ capacidad, cantidad });
         });
         return resultado; 
      };
    
  
  

}

    type Envase = { capacidad: any; cantidad: any };