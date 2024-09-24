import { Component } from '@angular/core';
import { Cell, Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { AlmacenService } from 'src/app/services/almacen.service';
import { RecepcionService } from 'src/app/services/recepcion.service';
import Swall from 'sweetalert2'
@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss']
})
export class RecepcionComponent {
  public clicked: any = [];
  public detalle: boolean = false;
  public edicion: boolean = false;
  public nueva: boolean = false;
  public Material_selected!: any;
  public n_word!: any
  public comentarios = false;
  public recepcion_id = ''

  constructor(public api: RecepcionService,
              public almacen:AlmacenService) {

  }


  recepcionID(id, index){
    this.recepcion_id = `${id}-${index}` 
  }
// Función para verificar si un lote tiene análisis en el almacén y devuelve la información
poseeAnalisis(lote){
  console.log(this.almacen.buscarPorLote(lote)); // Imprime en consola la información del análisis del lote
  return this.almacen.buscarPorLote(lote); // Retorna la información del análisis del lote
}

// Función asincrónica para enviar materiales al almacén
EnviarAlmacen = async(index: number, i: number) =>{
  const materiales = this.api.recepciones[index].materiales[i];
  await materiales.forEach((material:any) => {
    material.material = material.material._id; // Asigna el ID del material
    material.recepcion = this.api.recepciones[index]._id; // Asigna el ID de la recepción
  });
  this.almacen.GuardarAlmacen(materiales); // Guarda los materiales en el almacén
}

sumarNetos(materiales){
  let cantidad = materiales.reduce((total, material) => total + Number(material.neto), 0);
  return cantidad.toFixed(2)
}

// Función para mostrar u ocultar información adicional en una sección
showInfo(i) {
  if (!this.clicked[i]) {
    this.clicked[i] = true; // Si no se ha hecho clic previamente, muestra la información adicional
  } else {
    this.clicked[i] = false; // Si ya se hizo clic, oculta la información adicional
  }
}

// Función para mostrar el detalle de una recepción
mostrarDetalle() {
  this.detalle = true; // Muestra el detalle de la recepción
}

// Función para crear una nueva recepción
NuevaRecepcion() {
  this.nueva = true; // Indica que se va a crear una nueva recepción
}

// Función para publicar un material seleccionado
publicMaterial(x: number, y: number) {
  this.detalle = true; // Muestra el detalle del material seleccionado
  this.Material_selected = this.api.recepciones[x]; // Asigna el material seleccionado
  this.n_word = y; // Asigna un valor a la variable n_word
}

// Función para editar un material
EdicionDeMaterial(x: number, y: number) {
  this.edicion = true; // Indica que se va a editar un material
  this.Material_selected = this.api.recepciones[x]; // Asigna el material seleccionado para editar
  this.n_word = y; // Asigna un valor a la variable n_word
}

// Función para notificar una recepción
notificar(id: string) {
  this.api.NoticarRecepcion(id); // Notifica la recepción con el ID proporcionado
  setTimeout(() => {
    Swall.fire({
      text: this.api.mensaje.mensaje, // Muestra un mensaje
      icon: this.api.mensaje.icon, // Muestra un ícono
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 5000 // Configuración de la notificación
    })
  }, 1000) // Espera 1 segundo antes de mostrar la notificación
  console.log(id); // Imprime el ID en consola
}

// Función para verificar una recepción
checkar(id: string) {
  console.log(id); // Imprime el ID en consola
  this.api.checkearRecepcion(id); // Realiza la verificación de la recepción con el ID proporcionado
}

  DescargarFormato(informacion:any){


    let condiciones = [{
      cajas_buen_estado: true,
      cajas_limpias:true,
      calidad: true,
      envases_cerrado: false,
      identificacion: true
    },
    {
      cajas_buen_estado: true,
      cajas_limpias:true,
      calidad: true,
      envases_cerrado: false,
      identificacion: false
    }]

    let date = informacion.recepcion.split('-');
    informacion.recepcion = `${date[2]}-${date[1]}-${date[0]}`
    let conditions: string[] = informacion.condicion.map((obj:any) => {
      return Object.entries(obj)
        .filter(([propiedad, valor]) => propiedad !== '_id')
        .map(([propiedad, valor]) => {
          propiedad = propiedad.replace(/_/g, ' '); // Remove underscores from property name
          return valor ? `(x) ${propiedad}` : `( ) ${propiedad}`;
        })
        .join(' ');
    });

    const pdf = new PdfMakeWrapper();
    PdfMakeWrapper.setFonts(pdfFonts);
    pdf.pageOrientation('landscape');
    pdf.pageSize('A4');

    async function generarPDF(){
      pdf.add(
        new Table([
          [
            new Cell(await new Img('../../assets/poli_cintillo.png').width(60).margin([0, 5,0,0]).build()).alignment('center').rowSpan(4).end,
            new Cell(new Txt(`
            VERIFICACIÓN DE LAS CONDICIONES \n DEL MATERIAL RECIBIDO
            `).bold().end).alignment('center').fontSize(9).rowSpan(4).end,
            new Cell(new Txt('Código: FAL-002').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('N° de Revisión: 1').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Fecha de Revisión: 03/08/2023').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Página: 1 de 1').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
        ]).widths(['25%','50%','25%']).end
      )


      pdf.add(
        pdf.ln(1)
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt('DATOS DE RECEPCIÓN DE MATERIAL').end).alignment('center').color('#FFFFFF').fillColor('#000000').fontSize(8).end,
            new Cell(new Txt('').end).alignment('center').border([false]).color('#FFFFFF').fontSize(8).end,
            new Cell(new Txt('N° DE VERIFICACIÓN').end).alignment('center').color('#FFFFFF').fillColor('#000000').fontSize(8).end
          ]
        ]).widths(['80%','0.2%','19.8%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('').end).end
          ]
        ]).layout('noBorders').widths(['100%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('Nombre del proveedor').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Nombre del transportista').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Fecha de recepción').end).fontSize(8).alignment('center').fillColor('#dddddd').end,
            new Cell(new Txt('N° Factura/ Nota de entrega').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('N° Orden de compra').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('').end).border([false]).fontSize(8).end,
            new Cell(new Txt(`AL-MR-001`).bold().end).margin([0,5,0,0]).alignment('center').rowSpan(2).end,
          ],
          [
            new Cell(new Txt(informacion.proveedor.nombre).end).alignment('center').fontSize(8).end,
            new Cell(new Txt(informacion.transportista).end).alignment('center').fontSize(8).end,
            new Cell(new Txt(informacion.recepcion).end).alignment('center').fontSize(8).end,
            new Cell(new Txt(informacion.documento).end).alignment('center').fontSize(8).end,
            new Cell(new Txt(informacion.OC).end).alignment('center').fontSize(8).end,
            new Cell(new Txt('').end).border([false]).fontSize(8).end,
            new Cell(new Txt('').end).border([false]).fontSize(8).end,
          ]
        ]).widths(['15%','20%','15%','15%','14%','0.2%','21%']).end
      )

      pdf.add(
        pdf.ln(1)
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('DATOS DEL MATERIAL').end).alignment('center').color('#FFFFFF').fillColor('#9c9c9c').fontSize(8).end
          ]
        ]).widths(['100%']).layout('noBorders').end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('').end).end
          ]
        ]).layout('noBorders').widths(['100%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('Descripción').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Grupo').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('N° de lote').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Fecha de fabricación').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Código').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Presentación').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Capacidad').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Total de unidades').end).alignment('center').fillColor('#dddddd').fontSize(8).end,
            new Cell(new Txt('Total').end).alignment('center').fillColor('#dddddd').fontSize(8).end
          ]
        ]).widths(['17.5%','8%','10%','12.5%','10%','12.5%','10%','12.5%','7%']).end
      )

      for(let i=0;i<informacion.materiales.length;i++){
        pdf.add(
          new Table([
            [
              new Cell(new Txt(`${informacion.materiales[i][0].material.nombre} (${informacion.materiales[i][0].material.fabricante.alias})`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt(`${informacion.materiales[i][0].material.grupo.nombre}`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt(`${informacion.materiales[i][0].lote}`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt(`${informacion.materiales[i][0].material.fabricante.nombre}`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt('N/A').end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt(`${informacion.materiales[i][0].presentacion}`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt(`${informacion.materiales[i][0].neto} ${informacion.materiales[i][0].unidad}`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt(`${informacion.materiales.length}`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
              new Cell(new Txt(`${informacion.cantidad[i]} ${informacion.materiales[i][0].unidad}`).end).alignment('center').fontSize(8).border([true,false,true,true]).end,
            ],
            [
              new Cell(new Txt(`${conditions[i]}`).end).fillColor('#eeeeee').colSpan(9).fontSize(7).end,
              new Cell(new Txt('').end).fontSize(8).end,
              new Cell(new Txt('').end).fontSize(8).end,
              new Cell(new Txt('').end).fontSize(8).end,
              new Cell(new Txt('').end).fontSize(8).end,
              new Cell(new Txt('').end).fontSize(8).end,
              new Cell(new Txt('').end).fontSize(8).end,
              new Cell(new Txt('').end).fontSize(8).end,
              new Cell(new Txt('').end).fontSize(8).end
            ]
          ]).widths(['17.5%','8%','10%','12.5%','10%','12.5%','10%','12.5%','7%']).end
        )
      }
      pdf.add(
        new Table([
          [
            new Cell(new Txt('').end).end
          ]
        ]).layout('noBorders').widths(['100%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(
              new Table([
                [
                  new Cell(new Txt('Observación').end).alignment('center').color('#FFFFFF').fillColor('#000000').fontSize(9).end,
                ],
                [
                  new Cell(new Txt(`\n\n\n`).end).fontSize(8).end,

                ]
              ]).widths(['100%']).end
            ).fontSize(8).end,
            new Cell(
              new Table([
                [
                  new Cell(new Txt('Realizado por:').end).alignment('center').color('#FFFFFF').fillColor('#000000').fontSize(9).end,
                ],
                [
                  new Cell(new Txt(`Firma: Usuario\n\nFecha: 01-01-2020`).end).fontSize(8).end,

                ]
              ]).widths(['100%']).end
            ).fontSize(8).end,
            new Cell(new Table([
              [
                new Cell(new Txt('Validado por:').end).alignment('center').color('#FFFFFF').fillColor('#000000').fontSize(9).end,
              ],
              [
                new Cell(new Txt(`Firma: Usuario\n\nFecha:01-10-2020`).end).fontSize(8).end,

              ]
            ]).widths(['100%']).end).fontSize(8).end
          ]
        ]).widths(['50%','25%','25%']).layout('noBorders').end
      )
      pdf.create().download(`test`)
    }

    generarPDF()
  }

}
