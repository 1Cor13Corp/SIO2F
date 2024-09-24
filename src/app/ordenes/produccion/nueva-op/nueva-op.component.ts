import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { MaquinasService } from 'src/app/services/maquinas.service';
import { OcompraService } from 'src/app/services/ocompra.service';
import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ResizeEvent } from 'angular-resizable-element';
import * as moment from 'moment'

@Component({
  selector: 'app-nueva-op',
  templateUrl: './nueva-op.component.html',
  styleUrls: ['./nueva-op.component.scss']
})
export class NuevaOPComponent implements OnInit{

  ngOnInit(): void {
    this.currentDate = moment().format('YYYY-MM-DD');
  }

  constructor(
              public clientes:ClientesService,
              public oc:OcompraService,
              public maquinas:MaquinasService
  ){


  }

  public producto:any;
  public OP ={
    cliente: '',
    oc:'',
    producto:{
      materia_prima:{
        sustrato:[]
      }
    }
  }
  public Ordenes:any
  public productos:any
  public colorIndex = 0;
  public paletaVinotinto = [
    "#ffe4e1", // Rosa pastel
  "#d8f8e1", // Verde menta
  "#fcb7af", // Melocotón suave
  "#b0f2c2", // Azul cielo
  "#b0c2f2", // Lila delicado
  "#fabfb7", // Rosa empolvado
  "#fdf9c4", // Amarillo pálido
  "#c5c6c8", // Gris perla
  "#b2e2f2", // Azul celeste
  "#ddcdce"  // Beige suave
  ];
  public Trabajos:any;
  public Tintas:any
  public id_producto:any;
  public demasia = 0;
  maquinasOrigen:any = this.maquinas.maquinas;
  maquinasDestino:any = [];
  faseEliminada:any =  {}
  maquina:any = [];
  fase:any =[]
  cards = [
    {title: 'Identificación del producto', content: 'Contenido 1'},
    {title: 'Sustrato', content: 'Contenido 1'},
    {title: 'Tintas', content: 'Contenido 1'},
    {title: 'Barniz', content: 'Contenido 1'},
    {title: 'Embalaje', content: 'Contenido 1'},
    {title: 'Maquinas', content: 'Contenido 1'},
    {title: 'Fases', content: 'Contenido 1'},
    {title: 'Adicional', content: 'Contenido 1'},
    // Agrega más tarjetas según sea necesario
  ];
  currentIndex = 0;

  public coloresHex = {
    'A': '#FFFF00', // Amarillo
    'M': '#FF00FF', // Magenta
    'C': '#00FFFF', // Cyan
    'K': '#000000'  // Negro
  };

  public colores = [    
    "rgba(255, 87, 51, 1)", // Rojo    
    "rgba(199, 0, 57, 1)", // Rojo oscuro    
    "rgba(144, 12, 63, 1)", // Morado oscuro    
    "rgba(88, 24, 69, 1)", // Morado    
    "rgba(28, 28, 28, 1)", // Negro    
    "rgba(46, 204, 113, 1)", // Verde    
    "rgba(255, 195, 0, 1)", // Amarillo    
    "rgba(218, 247, 166, 1)", // Verde claro    
    "rgba(88, 24, 69, 1)", // Morado    
    "rgba(255, 87, 51, 1)"  // Rojo
  ];
  
  public ShowInfo:any;

public width_resized = {
  width:'110px'
}

public medidas:any

public dragDisabled = false

public width_tal = 110;
public position = 0;

selectedIdea: any;

test1 = '2024-06-11'
test2 = '2024-06-12'

mostrarTooltip: boolean = false;

currentDate!: string;


  toggleTooltip() {
    this.mostrarTooltip = !this.mostrarTooltip;
  }

  ShowToolTip(maquina, fase, date){
    if(!this.medidas[maquina].fases[fase].date[date]){
      this.medidas[maquina].fases[fase].date[date] = true;
    }else{
      this.medidas[maquina].fases[fase].date[date] = false;
    }
  }

showHideItem(i){
  if(!this.ShowInfo[i]){
    this.ShowInfo[i] = true;
  }else{
    this.ShowInfo[i] = false;
  }
}

getColor(index: number): string {
  const color = this.paletaVinotinto[this.colorIndex % this.paletaVinotinto.length];
  this.colorIndex++;
  return color;
}

  findOC(){
    this.Ordenes = this.oc.buscarPorCliente(this.OP.cliente);
  }

  findProducts(){
    let orden = this.Ordenes.find((x:any)=> x._id === this.OP.oc)
    this.productos = orden.pedido;
  }


  onDrop(event: CdkDragDrop<string[]>){
    if (event.previousContainer === event.container) {
      // Mover dentro del mismo arreglo
      moveItemInArray(this.maquinasDestino, event.previousIndex, event.currentIndex);
    } else {
      // Mover entre arreglos
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    setTimeout(() => {
      this.crearLargos(this.maquinasDestino)
    }, 1000);
  }

crearLargos(maquinasDestino) {
    const result = this.medidas || [];

    let hoy = moment().format('yyyy-MM-DD');
    
    maquinasDestino.forEach(maquina => {
        let maquinaObj = result.find(m => m.maquina === maquina);
        
        if (!maquinaObj) {
            maquinaObj = {
                maquina: maquina,
                fases: []
            };
            result.push(maquinaObj);
        }
        
        maquina.fases.forEach(() => {
            let faseArray = { 
                width: '110px',
                fecha: hoy,
                final: hoy,
                inicio:[],
                fin:[],
                date: [false]
            };
            
            if (!maquinaObj.fases.some(fase => fase.width)) {
                maquinaObj.fases.push(faseArray);
            }
        });
    });
    
    this.medidas = result;
    console.log(this.medidas);
}



  eliminarFase(maquinaIndex: number, faseIndex: number): void {
  if (!this.maquinasDestino[maquinaIndex].fases[faseIndex].borrado) {
    this.maquinasDestino[maquinaIndex].fases[faseIndex].borrado = true;
  } else {
    this.maquinasDestino[maquinaIndex].fases[faseIndex].borrado = false;
  }

  // Verificar si todas las fases están marcadas como borradas
  const todasFasesBorradas = this.maquinasDestino[maquinaIndex].fases.every(fase => fase.borrado);

  // Si todas las fases están borradas, establecer la primera fase como no borrada
  if (todasFasesBorradas) {
    this.maquinasDestino[maquinaIndex].fases[0].borrado = false;
  }
}


  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
    }
  }

  mostrarProducto(e){
    this.producto = this.productos[e.value].producto
    
      const TintasPorColor = {};
      // Recorremos el arreglo original
        this.producto.materia_prima.tintas.forEach((tintas) => {
          const { color } = tintas.tinta;
  
           // Si el proveedor no existe en el objeto, lo creamos
           if (!TintasPorColor[color]) {
             TintasPorColor[color] = [];
           }
  
            // Agregamos el material al proveedor correspondiente
            TintasPorColor[color].push(tintas.tinta);
          });
  
           // Convertimos el objeto en un arreglo de proveedores
           const arregloCategorizado:any = Object.entries(TintasPorColor);
           this.Tintas = arregloCategorizado;

  }

  Limitar(inicio, fin){

  }

  validate(event) {
    return true; // return false to prevent the resize
  }

  onResizeStart(event:any){
    this.dragDisabled = true;
  }
  async onResizeEnd(event: ResizeEvent, maquina: number, fase: number): Promise<void> {
    this.dragDisabled = true;
    
    if (event.rectangle.width) {
        let newWidth = Math.round(event.rectangle.width / 110) * 110;
        
        if (newWidth > 1540) {
            newWidth = 1540;
        }
        
        this.width_tal = newWidth;
        
        if (this.position + this.width_tal > 1540) {
            newWidth = 1540 - this.position;
        }
        
        await new Promise(resolve => setTimeout(resolve, 0)); // Simulate an asynchronous operation
        
        this.medidas[maquina].fases[fase].width = `${newWidth}px`;
        // Calculate this.test2 based on newWidth
        let daysToAdd = Math.floor(newWidth / 110); // Calculate number of days to add based on newWidth
        this.medidas[maquina].fases[fase].final = moment(this.medidas[maquina].fases[fase].fecha).add(daysToAdd -1, 'days').format('yyyy-MM-DD'); // Add days to test1 and assign to test2
      }

    
    this.dragDisabled = false;
}

  onDragEnd(event: CdkDragEnd, maquina, fase) {
    let hoy = moment().format('yyyy-MM-DD');
    const currentYPosition = event.source.getFreeDragPosition().y;
    let newPositionX = Math.round(event.source.getFreeDragPosition().x / 110) * 110;
    if(newPositionX < 0){
      newPositionX = 0;
    }else if(newPositionX > 1430){
      newPositionX = 1430
    }

    this.position = newPositionX;

    if(this.position + this.width_tal > 1540){
      this.width_tal = 1540 - this.position;
      this.medidas[maquina].fases[fase].width = `${this.width_tal}px`
    }

    // Calculate this.test2 based on newWidth
    let daysToAdd = Math.floor(this.position / 110); // Calculate number of days to add based on newWidth
    this.medidas[maquina].fases[fase].fecha = moment(hoy).add(daysToAdd, 'days').format('YYYY-MM-DD'); // Add days to test1 and assign to test1
    let widthString = this.medidas[maquina].fases[fase].width; // '330px'
    let widthNumber = parseInt(widthString, 10); // 330
    let daysToAdd2 = Math.floor(widthNumber / 110);
    this.medidas[maquina].fases[fase].final = moment(this.medidas[maquina].fases[fase].fecha).add(daysToAdd2 - 1, 'days').format('YYYY-MM-DD'); // Add days to test1 and assign to test2

    event.source.setFreeDragPosition({ x: newPositionX, y: currentYPosition });
}

onDragStarted(event: CdkDragStart){
  this.dragDisabled = false
}

formatearFecha(fecha){
  moment.locale('es');
  return moment(fecha).format('dddd D/M');
}

selectIdea(idea): void {
  if (this.selectedIdea === idea) {
    this.selectedIdea = null;
  } else {
    this.selectedIdea = idea;
  }
}

DropMaquina(maquina, fase: number) {
  const maquinaToAdd = { ...this.maquinas.maquinas[maquina] }; // Clonar la máquina para evitar modificar la original
  maquinaToAdd.fases = [maquinaToAdd.fases[fase]]; // Crear un nuevo array con solo la fase específica
  this.maquinasDestino.push(maquinaToAdd); // Agregar la máquina modificada a maquinasDestino
  this.crearLargos(this.maquinasDestino)
}

deleteFromUsar(i){
  this.maquinasDestino.splice(i,1)
}

ExtraerMedida(medida){
  let numero: number = parseFloat(medida.match(/\d+/)[0]);
  return numero/110;
}

ShowTime(e){
  console.log(e.value)
}

convertFrom24To12Format(time: string): string {
  const [hour, min] = time.split(':');
  let formattedHour = parseInt(hour);
  const part = formattedHour >= 12 ? 'pm' : 'am';

  if (formattedHour === 0) {
    formattedHour = 12;
  } else if (formattedHour > 12) {
    formattedHour -= 12;
  }

  const formattedMin = min.padStart(2, '0');
  return `${formattedHour}:${formattedMin} ${part}`;
}

generateDates(): string[] {
  const dates:any = [];
  for (let i = 1; i <= 14; i++) {
    const nextDate = moment(this.currentDate).add(i, 'days').format('YYYY-MM-DD');
    dates.push(nextDate);
  }
  return dates;
}

GuardarTrabajo(){
  console.log(this.medidas)
}

returnData(x,y,z){
  this.medidas[x].fases[y].inicio[z] = ''
  this.medidas[x].fases[y].fin[z] = ''
}

}
