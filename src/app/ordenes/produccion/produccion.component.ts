import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { MaquinasService } from 'src/app/services/maquinas.service';
import { OcompraService } from 'src/app/services/ocompra.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OproduccionService } from 'src/app/services/oproduccion.service';
import { ProductosService } from 'src/app/services/productos.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';


// Import pdfmake-wrapper and the fonts to use
import { Cell, Img, PdfMakeWrapper, Stack, Table, Txt } from 'pdfmake-wrapper';
import pdfFonts from "../../../assets/fonts/custom";
// import * as pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake

// If any issue using previous fonts import. you can try this:



@Component({
  selector: 'app-produccion',
  standalone: false,
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent implements OnInit {

  public nueva = false;
  public parametro_busqueda = '';
  public resultados: any = [];
  public productos_selected: any = [];
  public desde = ''
  public hasta = ''

  public anoActual: any;

  public gestiones: boolean = false;
  public orden_selected: any = [];

  public nueva_gestion: boolean = false;

  public devolucion: boolean = false;
  public op: any

  current: number[] = [0];
  target: number[] = [1000];
  progressPercentage: number[] = [0];

  showPaletteList: boolean = false;

  palete_selected: any = [];
  team_selected: any = []
  totales: any = []
  horas: any = []
  paletas: any = []

  fase_selected = 0

  // Inicializa un array de booleanos para controlar la visibilidad por cada fase y gestión
  visibilityFlags: boolean[][] = [];
  loading = true;

  public comentarios = false;
  public unique_id = ''




  ngOnInit(): void {
  }


  descargarOrden = async (orden) => {
    // Configuring custom fonts
    PdfMakeWrapper.setFonts(pdfFonts, {
      Gilroy: {
        normal: 'Gilroy-Light.otf',
        bold: 'Gilroy-ExtraBold.otf',
        italics: 'Gilroy-ExtraBold.otf',
        bolditalics: 'Gilroy-ExtraBold.otf'
      },
      Roboto: {
        normal: 'Roboto-Light.ttf',
        bold: 'Roboto-Bold.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-Italic.ttf'
      }
    });

    PdfMakeWrapper.useFont('Gilroy');

    // Array de pasos (steps) que puede variar en cantidad
    const steps = [
      { title: 'Roland 700', subtitle: 'Impresión', date: '18/03/2025' },
      { title: 'Barnizadora', subtitle: 'Barnizado', date: '19/03/2025' },
      { title: 'Troqueladora', subtitle: 'Troquelado', date: '20/03/2025' },
      { title: 'Pegadora', subtitle: 'Pegado', date: '21/03/2025' },
      { title: 'Entrega', subtitle: 'Final', date: '22/03/2025' },
      { title: 'Pegadora', subtitle: 'Pegado', date: '21/03/2025' },
      { title: 'Entrega', subtitle: 'Final', date: '22/03/2025' }
    ];

    const stepsCount = steps.length;
    const columnWidth = 514 / steps.length;               // ancho fijo de cada columna
    const tableWidth = stepsCount * columnWidth;
    const circleRadius = 10;               // radio del círculo
    const circleCenterY = 20;              // posición vertical en el canvas

    // Fila superior: textos (título y subtítulo) centrados en cada celda
    const topRow = steps.map(step => ({
      text: `${step.title}\n${step.subtitle}`,
      alignment: 'center',
      fontSize: 8,
      margin: [0, 3, 0, 0]
    }));

    // Fila inferior: fechas centradas en cada celda
    const bottomRow = steps.map(step => ({
      text: step.date,
      alignment: 'center',
      fontSize: 6,
      margin: [0, 3, 0, 0]
    }));

    // Fila central: un canvas que abarca todas las columnas
    // Se calcula la posición de cada círculo en base a la columna en la que debe estar
    const canvasItems: any[] = [];
    for (let i = 0; i < stepsCount; i++) {
      // Posición X: centro exacto de la columna (i * columnWidth + half column)
      const centerX = i * columnWidth + columnWidth / 2;
      // Dibujar el círculo
      canvasItems.push({
        type: 'ellipse',
        x: centerX,
        y: circleCenterY,
        color: 'white',
        lineColor: '#c5c5c5',
        lineWidth: 2,
        r1: circleRadius,
        r2: circleRadius
      });
      // Si no es el último, dibujar la línea de conexión al siguiente círculo
      if (i < stepsCount - 1) {
        const nextCenterX = (i + 1) * columnWidth + columnWidth / 2;
        canvasItems.push({
          type: 'line',
          x1: centerX + circleRadius,    // borde derecho del círculo actual
          y1: circleCenterY,
          x2: nextCenterX - circleRadius, // borde izquierdo del siguiente círculo
          y2: circleCenterY,
          lineWidth: 5,
          lineColor: '#c5c5c5'
        });
      }
    }

    // La fila del canvas se arma con una celda que hace colSpan de todas las columnas
    // y se completan las celdas restantes con objetos vacíos para que la fila tenga el mismo número de celdas
    const canvasRow = [
      {
        canvas: canvasItems,
        width: tableWidth,
        height: 60,
        colSpan: stepsCount
      },
      ...Array(stepsCount - 1).fill({})
    ];


    const pdf = new PdfMakeWrapper();

    // pdf.watermark( new Txt('watermark with Txt object').color('blue').end );

    pdf.add(
      new Table([
        [
          new Cell(await new Img('../../assets/poli_cintillo.png').width(60).margin([0, 5, 0, -5]).build()).alignment('center').rowSpan(4).end,
          new Cell(new Txt(`
                ORDEN DE PRODUCCIÓN
                `).bold().end).alignment('center').fontSize(11).rowSpan(4).end,
          new Cell(new Txt('Código: FPR-008').end).fillColor('#dedede').fontSize(5).alignment('center').end,
        ],
        [
          new Cell(new Txt('').end).end,
          new Cell(new Txt('').end).end,
          new Cell(new Txt('N° de Revisión: 1').end).fillColor('#dedede').fontSize(5).alignment('center').end,
        ],
        [
          new Cell(new Txt('').end).end,
          new Cell(new Txt('').end).end,
          new Cell(new Txt('Fecha de Revision: 12/03/2025').end).fillColor('#dedede').fontSize(5).alignment('center').end,
        ],
        [
          new Cell(new Txt('').end).end,
          new Cell(new Txt('').end).end,
          new Cell(new Txt('Página: 1 de 1').end).fillColor('#dedede').fontSize(5).alignment('center').end,
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        })
        .widths(['25%', '50%', '25%']).end
    )

    pdf.add(
      new Txt(' ').fontSize(10).end
    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt('INFORMACIÓN DEL PRODUCTO').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
          new Cell(new Txt('').end).border([false]).end,
          new Cell(new Txt('ORDEN DE PRODUCCIÓN').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end
        ],
        [
          new Cell(new Txt('NOMBRE:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('').end).border([false]).end,
          new Cell(
            new Txt([
              { text: 'N', fontSize: 5.7 },
              { text: 'º', font: 'Roboto', fontSize: 5.7 }
            ]).end
          ).border([true, false, true, false]).end
        ],
        [
          new Cell(new Txt(orden.producto[0].identificacion.producto).fontSize(11).end).margin([0, -3, 0, -3]).border([true, false, true, true]).end,
          new Cell(new Txt('').end).border([false]).end,
          new Cell(new Txt(orden.numero_op).alignment('center').fontSize(22).bold().end).margin([0, -15, 0, -3]).border([true, false, true, true]).end
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['69%', '1%', '30%']).end
    )

    let emision = moment(orden.createdAt).format('DD/MM/YYYY')
    pdf.add(
      new Table([
        [
          new Cell(new Txt('CÓDIGO DE ESPECIFICACIÓN:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('CÓDIGO DE PRODUCTO CLIENTE:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('').end).border([false]).end,
          new Cell(new Txt('FECHA DE EMISIÓN').fontSize(5.7).end).border([true, false, true, false]).end
        ],
        [
          new Cell(new Txt(`E-${orden.producto[0].identificacion.cliente.codigo}-${orden.producto[0].identificacion.codigo}-${orden.producto[0].identificacion.version}`).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt('EEM542-02-PL').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt('').end).border([false]).end,
          new Cell(new Txt(`${emision}`).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['30%', '38.5%', '1%', '30.6%']).end
    )
    pdf.add(
      new Table([
        [
          new Cell(new Txt(' ').fontSize(1).end).border([false, false, false, false]).end
        ]
      ]).widths(['100%']).end

    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt('INFORMACIÓN DEL CLIENTE').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
        ]
      ])
        .widths(['100%']).end
    )

    let fecha_oc = moment(orden.solicitud).format('DD/MM/YYYY')

    pdf.add(
      new Table([
        [
          new Cell(new Txt('NOMBRE:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(
            new Txt([
              { text: 'N', fontSize: 5.7 },
              { text: 'º', font: 'Roboto', fontSize: 5.7 },
              { text: ' ORDEN DE COMPRA', fontSize: 5.7 },

            ]).end
          ).border([true, false, true, false]).end,
          new Cell(new Txt('FECHA DE OC:').fontSize(5.7).end).border([true, false, true, false]).end
        ],
        [
          new Cell(new Txt(orden.producto[0].identificacion.cliente.nombre).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(orden.oc.orden).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(fecha_oc).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['50%', '25%', '25%']).end
    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt(' ').fontSize(1).end).border([false, false, false, false]).end
        ]
      ]).widths(['100%']).end

    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt('CANTIDADES Y ENTREGAS').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
        ]
      ]).widths(['100%']).end
    )
    pdf.add(
      new Table([
        [
          new Cell(new Txt('CANTIDAD SOLICITADA:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('FECHA SOLICITADA:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('LUGAR DE ENTREGA:').fontSize(5.7).end).border([true, false, true, false]).end
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['30%', '30%', '40%']).end
    )


    // Filtramos los pedidos que correspondan al producto de la orden
    const pedidosFiltrados = orden.oc.pedido.filter(pedido => pedido.producto === orden.producto[0]._id);

    // Iteramos sobre los pedidos filtrados para formatear la fecha y la cantidad
    pedidosFiltrados.forEach(pedido => {
      // Formateamos la fecha
      pedido.solicitud = moment(pedido.solicitud).format('DD/MM/YYYY');
      // Formateamos la cantidad: separador de miles '.' y decimales ','
      // Usamos toLocaleString con la configuración de 'es-ES'
      pedido.cantidadFormateada = Number(pedido.cantidad).toLocaleString('es-ES');
    });

    // Creamos las filas de la tabla con los datos formateados
    const filasTabla = pedidosFiltrados.map(pedido => [
      new Cell(new Stack([pedido.cantidadFormateada]).fontSize(11).end)
        .margin([0, -3, 0, 0])
        .border([true, false, true, true])
        .end,
      new Cell(new Stack([pedido.solicitud]).fontSize(11).end)
        .margin([0, -3, 0, 0])
        .border([true, false, true, true])
        .end,
      // Aquí puedes mantener o modificar el valor del lugar, por ejemplo:
      new Cell(new Stack(['Planta San Joaquin']).fontSize(11).end)
        .margin([0, -3, 0, 0])
        .border([true, false, true, true])
        .end
    ]);


    let total = pedidosFiltrados.reduce((acumulador, pedido) => acumulador + pedido.cantidad, 0);
    total = Number(total).toLocaleString('es-ES')

    // Agregamos la tabla al PDF
    pdf.add(
      new Table(filasTabla)
        .layout({
          hLineWidth: (rowIndex, node, columnIndex) => 0.5,
          vLineWidth: (rowIndex, node, columnIndex) => 0.5,
          hLineColor: (rowIndex, node, columnIndex) => '#555',
          vLineColor: (rowIndex, node, columnIndex) => '#555'
        })
        .widths(['30%', '30%', '40%'])
        .heights(38)
        .end
    );

    pdf.add(
      new Table([
        [
          new Cell(new Txt('TOTAL:').fontSize(5.7).end).border([true, false, true, false]).end,
        ],
        [
          new Cell(new Txt(total).bold().fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
        ]
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['28.9%']).end
    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt(' ').fontSize(1).end).border([false, false, false, false]).end
        ]
      ]).widths(['100%']).end

    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt('SUSTRATO / MONTAJE / IMPRESIÓN').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
        ]
      ]).widths(['100%']).end
    )

    console.log(orden.sustrato.sustrato.nombre)

    pdf.add(
      new Table([
        [
          new Cell(new Txt('NOMBRE:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(
            new Txt([
              { text: 'GRAMAJE(g/m', fontSize: 5.7 },
              { text: '²', font: 'Roboto', fontSize: 5.7 },
              { text: ')', fontSize: 5.7 },
            ]).end
          ).border([true, false, true, false]).end,
          new Cell(new Txt('CALIBRE(µm):').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('TAMAÑO DEL PLIEGO (cm):').fontSize(5.7).end).border([true, false, true, false]).end
        ],
        [
          new Cell(new Txt(orden.sustrato.sustrato.nombre).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(orden.sustrato.sustrato.gramaje).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(orden.sustrato.sustrato.calibre).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt('73 x 103').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['55%', '15%', '15%', '15%']).end
    )


    let asignadas = orden.hojas + orden.demasia;
    let demasia_percent:any = orden.demasia * 100 / asignadas

    asignadas = Number(asignadas).toLocaleString('es-ES')
    let demasia = Number(orden.demasia).toFixed(2)
    demasia = Number(demasia).toLocaleString('es-ES')
    let pa_imprimir = Number(orden.hojas).toLocaleString('es-ES')

    demasia_percent = Number(demasia_percent.toFixed(2)).toLocaleString('es-ES')



    pdf.add(
      new Table([
        [
          new Cell(new Txt('TAMAÑO A IMPRIMIR (cm):').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('DIRECCIÓN DE FIBRA:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(
            new Txt([
              { text: 'N', fontSize: 5.7 },
              { text: 'º', font: 'Roboto', fontSize: 5.7 },
              { text: ' EJEMPLARES', fontSize: 5.7 },
            ]).end
          ).border([true, false, true, false]).end,
          new Cell(new Txt('HOJAS A ASIGNAR:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('HOJAS DE DEMASÍA:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('HOJAS A IMPRIMIR:').fontSize(5.7).end).border([true, false, true, false]).end,
        ],
        [
          new Cell(new Txt('72 x 102').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt('102').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(orden.ejemplares).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(asignadas).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(`${demasia}(${demasia_percent}%)`).fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
          new Cell(new Txt(pa_imprimir).bold().fontSize(14).end).margin([0, -6, 0, 0]).border([true, false, true, true]).end,
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['16.8%', '16%', '16%', '20%', '15.7%', '15.6%']).end
    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt(' ').fontSize(1).end).border([false, false, false, false]).end
        ]
      ]).widths(['100%']).end

    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt('COLORES / TINTAS / BARNIZ').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
        ]
      ]).widths(['100%']).end
    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt('SEC:').fontSize(5.7).end).border([true, false, false, false]).end,
          new Cell(new Txt('COLORES:').fontSize(5.7).end).border([false, false, true, false]).end,
          new Cell(new Txt('CÓDIGO DE PELICULAS:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('TINTA:').fontSize(5.7).end).border([true, false, true, false]).end,
          new Cell(new Txt('CANTIDAD (Kg):').fontSize(5.7).end).border([true, false, true, false]).end,
        ],
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['3%', '22%', '20%', '45%', '10%']).end
    )

    let data =
    {
      seq: '01',
      colores: 'PANTONE 3435-C',
      peliculas: 'PC-006-3-A-1',
      tinta: 'Amarillo Fondo Mavesa (Huada)',
      cantidad: '1,50'
    }


    for (let i = 0; i < orden.producto[0].impresion.secuencia[0].length; i++) {
      pdf.add(
        new Table([
          [
            new Cell(new Txt(`${i+1}`).fontSize(11).end).margin([0, 0, 0, 0]).border([true, false, false, false]).fillColor(i % 2 === 0 ? '#F2F2F2' : '#FFFFFF').end,
            new Cell(new Txt(orden.producto[0].impresion.secuencia[0][i]).fontSize(11).end).margin([0, 0, 0, 0]).border([false, false, true, false]).fillColor(i % 2 === 0 ? '#F2F2F2' : '#FFFFFF').end,
            new Cell(new Txt(data.peliculas).fontSize(11).end).margin([0, 0, 0, 0]).border([true, false, true, false]).fillColor(i % 2 === 0 ? '#F2F2F2' : '#FFFFFF').end,
            new Cell(new Txt(data.tinta).fontSize(11).end).margin([0, 0, 0, 0]).border([true, false, true, false]).fillColor(i % 2 === 0 ? '#F2F2F2' : '#FFFFFF').end,
            new Cell(new Txt(data.cantidad).fontSize(11).end).margin([0, 0, 0, 0]).border([true, false, true, false]).fillColor(i % 2 === 0 ? '#F2F2F2' : '#FFFFFF').end,
          ],
        ])
          .layout({
            hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
            vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
            hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
            vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          }).widths(['3%', '22%', '20%', '45%', '10%']).end
      )
    }

    pdf.add(
      new Table([
        [
          new Cell(new Txt(' ').fontSize(1).end).border([false, true, false, false]).end
        ]
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['100%']).end

    )
    pdf.add(
      new Table([
        [
          new Cell(
            new Table([
              [
                new Cell(new Txt('BARNICES / PEGAMENTO').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
              ],
            ]).widths(['100%']).end
          ).end,
          new Cell(
            new Table([
              [
                new Cell(new Txt('EMBALAJE').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
              ],
            ]).widths(['100%']).end
          ).end
        ],
        [
          new Cell(
            new Table([
              [
                new Cell(new Txt('BARNIZ ACUOSO / UV / ESPECIAL:').fontSize(5.7).end).border([true, false, true, false]).end,
              ],
              [
                new Cell(new Txt('Barniz Acuoso Alto Brillo (Prisco)').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
              ],
              [
                new Cell(new Txt('PEGAMENTO:').fontSize(5.7).end).border([true, false, true, false]).end,
              ],
              [
                new Cell(new Txt('PEGA HV 104 -15P (Pegadhex)').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
              ]
            ]).margin([0, -4])
              .layout({
                hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
                vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
                hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
                vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
              }).widths(['100%']).end
          ).end,
          new Cell(
            new Table([
              [
                new Cell(new Txt('CÓDIGO DE CAJA:').fontSize(5.7).end).border([true, false, true, false]).end,
                new Cell(new Txt('CANT. NECESARIA:').fontSize(5.7).end).border([true, false, true, false]).end,
                new Cell(new Txt('UNID. POR CAJA:').fontSize(5.7).end).border([true, false, true, false]).end,
                new Cell(new Txt('CINTA EMB. (m):').fontSize(5.7).end).border([true, false, true, false]).end,
              ],
              [
                new Cell(
                  new Txt([
                    { text: 'Caja N', fontSize: 11 },
                    { text: 'º', font: 'Roboto', fontSize: 11 },
                    { text: ' 11', fontSize: 11 },
                  ]).end
                ).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
                new Cell(new Txt('154').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
                new Cell(new Txt('136.000').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
                new Cell(new Txt('1.560,25').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
              ],
            ])
              .layout({
                hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
                vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
                hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
                vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
              }).widths(['25%', '25%', '25%', '25%']).end
          ).margin([0, -4]).border([false]).end
        ]
      ]).layout('noBorders')
        .widths(['50%', '50%']).end
    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt(' ').fontSize(3).end).border([false, false, false, false]).end
        ]
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['100%']).end

    )

    pdf.add(
      new Table([
        [
          new Cell(new Txt('PLANIFICACIÓN').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
        ]
      ]).widths(['100%']).end
    )


    // Se arma la tabla con 3 filas: superior, canvas y fechas.
    // Se define un layout personalizado sin padding para evitar desajustes.
    pdf.add({
      table: {
        widths: Array(stepsCount).fill(columnWidth),
        body: [
          topRow,
          canvasRow,
          bottomRow
        ]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0
      }
    });


    pdf.add(
      new Table([
        [
          new Cell(new Txt(' ').fontSize(3).end).border([false, false, false, false]).end
        ]
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['100%']).end

    )

    pdf.add(
      new Table([
        [

          new Cell(new Txt('OBSERVACIONES').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
          new Cell(new Txt(' ').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).end,
          new Cell(new Txt('ELABORADO POR').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
        ],
        [
          new Cell(new Txt('').fontSize(11).end).border([true, false, true, false]).end,
          new Cell(new Txt('').fontSize(11).end).border([false]).end,
          new Cell(new Txt('NOMBRE:').fontSize(5.7).end).border([true, false, true, false]).end,
        ],
        [
          new Cell(new Txt('').fontSize(11).end).border([true, false, true, false]).end,
          new Cell(new Txt('').fontSize(11).end).border([false]).end,
          new Cell(new Txt('Andrés Calcurian:').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, false]).end,
        ],
        [
          new Cell(new Txt('').fontSize(11).end).border([true, false, true, false]).end,
          new Cell(new Txt('').fontSize(11).end).border([false]).end,
          new Cell(new Txt('FIRMA:').fontSize(5.7).end).border([true, false, true, false]).end,
        ],
        [
          new Cell(new Txt('').fontSize(11).end).border([true, false, true, false]).end,
          new Cell(new Txt('').fontSize(11).end).border([false]).end,
          new Cell(new Txt(' ').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, false]).end,
        ],
        [
          new Cell(new Txt('').fontSize(11).end).border([true, false, true, false]).end,
          new Cell(new Txt('').fontSize(11).end).border([false]).end,
          new Cell(new Txt('FECHA:').fontSize(5.7).end).border([true, false, true, false]).end,
        ],
        [
          new Cell(new Txt('').fontSize(11).end).border([true, false, true, true]).end,
          new Cell(new Txt('').fontSize(11).end).border([false]).end,
          new Cell(new Txt('18/03/2025').fontSize(11).end).margin([0, -3, 0, 0]).border([true, false, true, true]).end,
        ]
      ])
        .layout({
          hLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          vLineWidth: (rowIndex?: number, node?: any, columnIndex?: number) => 0.5,
          hLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
          vLineColor: (rowIndex?: number, node?: any, columnIndex?: number) => '#555',
        }).widths(['69%', '1%', '30%']).end
    )

    // pdf.add(
    //   new Table([
    //     [
    //       new Cell(new Txt('POST-IMPRESIÓN').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end,
    //       new Cell(new Txt('').end).border([false]).end,
    //       new Cell(new Txt('BARNICES / PEGAMENTO').alignment('center').bold().fontSize(9).color('#FFFFFF').end).border([false]).fillColor('#a5acb2').end
    //     ],
    //   ]).widths(['54%','1%','45%']).end
    // )

    // pdf.add(
    //   new Table([
    //     [
    //       new Cell(new Txt('FASE:').fontSize(5.7).end).border([true,false,true,false]).end,
    //       new Cell(new Txt('MÁQUINA:').fontSize(5.7).end).border([true,false,true,false]).end,
    //       new Cell(new Txt('').fontSize(5.7).end).border([false]).end,
    //       new Cell(new Txt('BARNIZ ACUOSO / UV / ESPECIAL:').fontSize(5.7).end).border([true,false,true,false]).end,
    //     ],
    //   ]).widths(['26.5%','26.5%','1.3%','45.7%']).end
    // )
    // pdf.add(
    //   new Table([
    //     [
    //       new Cell(new Txt('FASE:').fontSize(11).end).border([true,false,true,false]).end,
    //       new Cell(new Txt('MÁQUINA:').fontSize(11).end).border([true,false,true,false]).end,
    //       new Cell(new Txt('').fontSize(11).end).border([false]).end,
    //       new Cell(new Txt('BARNIZ ACUOSO / UV / ESPECIAL:').fontSize(11).end).border([true,false,true,false]).end,
    //     ],
    //   ]).widths(['26.5%','26.5%','1.3%','45.7%']).end
    // )



    pdf.create().download();
  }







  // Función para alternar la visibilidad
  toggleVisibility(index_fase: number, index_gestion: number) {
    this.visibilityFlags[index_fase][index_gestion] = !this.visibilityFlags[index_fase][index_gestion];
  }

  constructor(public api: OproduccionService,
    public clientes: ClientesService,
    public productos: ProductosService
  ) {
    this.anoActual = new Date().getFullYear();
  }


  buscarSiExisteDefecto(defectos: any, index: any) {
    let defecto = defectos.find(x => x.paleta === index);
    if (defecto) {
      return {
        existe: true,
        defectos: defecto.defectos
      }
    } else {
      return {
        existe: false,
      }
    }
  }

  formatearHora(fecha24Horas: string) {
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

  cerrar_nueva_gestion() {
    setTimeout(() => {
      this.progress();
    }, 1000);
    this.gestiones = true;
    this.nueva_gestion = false;
  }


  togglePaletteList(index_fase, gestion): void {
    this.palete_selected[index_fase][gestion] = !this.palete_selected[index_fase][gestion]
    this.showPaletteList = !this.showPaletteList
  }

  Gestiones(orden: any) {
    this.gestiones = true
    this.orden_selected = JSON.parse(JSON.stringify(orden));
    this.progress()
  }

  showTeam(i, j) {
    if (!this.team_selected[i][j]) {
      this.team_selected[i][j] = true;
    } else {
      this.team_selected[i][j] = false;
    }
  }

  progress() {
    this.loading = true;

    for (let i = 0; i < this.orden_selected.fases.length; i++) {
      if (!this.totales[i]) {
        this.totales[i] = {
          hojas: 0,
          horas: 0,
          paletas: 0,
          tickets: 0
        };
      }

      this.totales[i] = {
        hojas: 0,
        horas: 0,
        paletas: 0,
        tickets: 0
      };

      this.visibilityFlags[i] = [];
      this.current[i] = 0;
      this.progressPercentage[i] = 0; // 💡 Inicia en 0 para la animación

      if (i === 0) {
        this.target[i] = this.orden_selected.cantidad;
      } else {
        this.target[i] = this.current[i - 1];
      }

      for (let j = 0; j < this.api.GestionesDeFase(this.orden_selected, i).length; j++) {
        if (!this.palete_selected[i]) this.palete_selected[i] = [];
        if (!this.team_selected[i]) this.team_selected[i] = [];
        if (!this.palete_selected[i][j]) this.palete_selected[i][j] = false;
        if (!this.team_selected[i][j]) this.team_selected[i][j] = false;

        this.visibilityFlags[i][j] = true;

        let gestion_ = this.api.GestionesDeFase(this.orden_selected, i)[j];
        this.current[i] += Number(gestion_.productos);

        const inicio = moment(gestion_.inicio, 'HH:mm');
        const fin = moment(gestion_.fin, 'HH:mm');
        const duracion = moment.duration(fin.diff(inicio));
        const horas = duracion.asHours();

        this.totales[i].hojas += gestion_.hojas;
        this.totales[i].horas += Number(horas);
        this.totales[i].paletas += gestion_.paletas;
        this.totales[i].tickets += gestion_.defectos.length - 1;
      }

      // 💡 Efecto de llenado progresivo
      const finalProgress = (this.current[i] * 100) / this.target[i]; // Valor objetivo
      let incremento = 0; // Inicia en 0

      const interval = setInterval(() => {
        if (incremento < finalProgress) {
          incremento += 2; // Puedes ajustar la velocidad de llenado
          this.progressPercentage[i] = incremento;
        } else {
          this.progressPercentage[i] = finalProgress; // Asegurar que llegue al valor exacto
          clearInterval(interval);
        }
      }, 15); // Ajusta la velocidad de la animación (más bajo = más rápido)

      if (i === this.orden_selected.fases.length - 1) {
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

  filtrarResultadosProducto(valor: any) {
    this.resultados = this.api.orden.filter(item =>
      item.producto[0]._id.includes(valor.value)
    );
  }

  BuscarPorFecha() {
    const desde_ = new Date(this.desde);
    const hasta_ = new Date(this.hasta);

    this.resultados = this.api.orden.filter(item => {
      const fechaItem = new Date(item.createdAt);
      return fechaItem >= desde_ && fechaItem <= hasta_;
    });
  }


  BuscarProductos(event: any) {
    this.productos_selected = this.productos.buscarPorClientes(event.value);
  }


}
