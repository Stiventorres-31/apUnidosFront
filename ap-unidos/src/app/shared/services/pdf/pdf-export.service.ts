import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AppComponent } from '../../../app.component';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor(private AppComponent: AppComponent) { }

  generatePDF(pdf: HTMLElement, name: string = "orden-de-compra", cantidad: number = 1): Observable<boolean> {
    // Creamos un Subject para manejar el estado de la exportación
    const exportStatus = new Subject<boolean>();

    // Muestra el mensaje inicial de generación
    this.AppComponent.alert({
      summary: "Generando PDF",
      detail: "Por favor espera, el documento se está generando...",
      severity: 'info',
      life: 3000
    });

    // Generación del PDF con html2canvas
    html2canvas(pdf, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4',true);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calcular el factor de escala para ajustar el contenido en una página
      const scaleFactor = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
      
      // Dimensiones ajustadas al factor de escala
      const imgWidth = canvasWidth * scaleFactor;
      const imgHeight = canvasHeight * scaleFactor;

      // Centramos la imagen en el PDF ajustando la posición Y para quitar el espacio blanco arriba y abajo
      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', Math.max(0, xOffset),0, imgWidth, imgHeight, 'SLOW');
      pdf.save(`${name}.pdf`);

      // Muestra el mensaje de éxito y emite true en el Observable
      this.AppComponent.alert({
        summary: "Exportación exitosa",
        detail: "El PDF se ha exportado correctamente.",
        severity: 'success'
      });
      exportStatus.next(true); // Emitimos true al terminar exitosamente
      exportStatus.complete();
    }).catch(() => {
      // Muestra el mensaje de error y emite false en el Observable
      this.AppComponent.alert({
        summary: "Ocurrió un error",
        detail: "No se pudo realizar la exportación. Inténtalo de nuevo más tarde.",
        severity: 'error'
      });
      exportStatus.next(false); // Emitimos false en caso de error
      exportStatus.complete();
    });

    // Retornamos el Observable
    return exportStatus.asObservable();
  }
}
