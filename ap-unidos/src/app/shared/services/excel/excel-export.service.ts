import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormatDateService } from '../format-date/format-date.service';
import ExcelJS from 'exceljs';
import { AppComponent } from '../../../app.component';

@Injectable({
  providedIn: 'root'
}) 
export class ExcelExportService {

  constructor(private AppComponent:AppComponent ) { }

  exportToExcel(datos: any[], nombre: string = "datos") {
    const formatDateService = new FormatDateService();
    let today: any = new Date();
    today = formatDateService.formatDateString(today.toISOString());

    // Convertir los datos JSON a una hoja de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);

    // Definir el rango de datos en formato A1 notation
    const range = XLSX.utils.decode_range(ws['!ref']!);
    const tblRange = XLSX.utils.encode_range({
      s: { r: 0, c: 0 }, // inicio en la celda A1
      e: { r: range.e.r, c: range.e.c } // fin en la última celda
    });

    // Agregar el filtro automático a la tabla
    ws['!autofilter'] = { ref: tblRange };

    const headers = Object.keys(datos[0]);

    // Ajustar el ancho de las columnas según el contenido
    const columnWidths = headers.map(header => {
      const maxLength = Math.max(
        header.length,
        ...datos.map((d: any) => d[header] ? d[header].toString().length : 0)
      );
      return { wch: maxLength + 2 }; // Añadir un pequeño espacio adicional
    });

    ws['!cols'] = columnWidths;
    // Ajustar la altura de las filas
    ws['!rows'] = Array(range.e.r + 1).fill({ hpt: 28 }); // Establece la altura de las filas en puntos (24pt en este caso)


    // Aplicar estilos personalizados a los encabezados de forma dinámica
    headers.forEach((header, index) => {
      const cell = XLSX.utils.encode_cell({ r: 0, c: index }); // 'A1', 'B1', 'C1', etc.
      ws[cell] = { v: header, s: {
        fill: {
          fgColor: { rgb: '004ABA' } // Color de fondo en formato RGB
        },
        font: {
          bold: true,
          color: { rgb: 'FFFFFF' } // Color de la fuente en formato RGB (blanco)
        },
        alignment: {
          horizontal: "center", // Alineación horizontal (left, center, right)
          vertical: "center",   // Alineación vertical (top, center, bottom)
          wrapText: true        // Ajuste de texto para que se muestre en múltiples líneas si es necesario
        }
      }};
    });
  
 

    // Crear un nuevo libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Agregar la hoja de Excel al libro
    XLSX.utils.book_append_sheet(wb, ws, nombre);

    // Generar el archivo Excel en formato binario
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo Excel usando FileSaver
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${nombre}-${today}.xlsx`);
  }


  async getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Esto convertirá la imagen a base64
    });
  }



  async exportToExcelRemastered(datos: any[], nombre: string = "datos") {
    this.AppComponent.alert({ summary: "Generando excel", detail: " Por favor, espere mientras se genera el excel.", severity: "info" })
    const formatDateService = new FormatDateService();
    let today: any = new Date();
    today = formatDateService.formatDateString(today.toISOString());

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(nombre);

    // Definir el número de filas que ocuparán las imágenes (por ejemplo, 5 filas)
    const imageRows = 6;
    const startCol = 3; // Comenzar en la tercera columna (índice 2 en ExcelJS, que es la columna C)

    // Convertir la imagen de la URL a base64
    const logoOlivosBase64 = await this.getBase64ImageFromUrl( window.location.origin +'/assets/img/marca/logo_penta.png');

    // Agregar una imagen en la esquina superior izquierda
    const imageIdLeft = workbook.addImage({
      base64: logoOlivosBase64,
      extension: 'jpeg',
    });

    worksheet.addImage(imageIdLeft, {
      tl: { col: 2, row: 0 }, // Esquina superior izquierda (A1)
      ext: { width: 250, height: 80 }
    });

    // Agregar la misma imagen en la esquina superior derecha
    const imageIdRight = workbook.addImage({
      base64: logoOlivosBase64,
      extension: 'jpeg',
    });

    worksheet.addImage(imageIdRight, {
      tl: { col: Object.keys(datos[0]).length + startCol - 4, row: 0 }, // Esquina superior derecha
      ext: { width: 250, height: 80 }
    });

    // Ajustar el espacio entre las imágenes y la tabla
    const startRow = imageRows + 1;
    // Crear un arreglo para definir las columnas de la tabla
    const tableColumns = Object.keys(datos[0]).map((key) => ({
      name: key,
      filterButton: true, // Habilitar filtro en cada columna
    }));

    // Crear la tabla en el Excel, empezando desde `startRow` y `startCol`
    worksheet.addTable({
      name: 'DatosTabla',
      ref: `${worksheet.getColumn(startCol).letter}${startRow}`, // Celda inicial (por ejemplo, C7)
      headerRow: true,
      columns: tableColumns,
      rows: datos.map(d => Object.values(d)),
      style: {
        theme: 'TableStyleMedium2', // Puedes usar un estilo existente como base
        showRowStripes: true,
      },
    });


    // Estilo personalizado para el encabezado (verde)
    const headerRow = worksheet.getRow(startRow);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3b5e96' }, // Fondo verde
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // Texto blanco
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  
    // Aplicar rayas verdes a las filas de la tabla
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > startRow) { // Aplicar a las filas de datos, no al encabezado
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: rowNumber % 2 === 0 ? { argb: 'dbeafe' } : { argb: 'FFFFFF' }, // Rayas en verde claro
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
      }
    });

    // Ajustar el ancho de las columnas basado en el contenido
    worksheet.columns.forEach((column: Partial<ExcelJS.Column>) => {
      let maxLength = 0;
      if (column.eachCell) {  // Verificamos que el método eachCell esté definido
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2; // Ajustar ancho de columna con un pequeño margen
      }
    });

    // Generar el archivo Excel y guardarlo
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${nombre}-${today}.xlsx`)
    })
  }
}
