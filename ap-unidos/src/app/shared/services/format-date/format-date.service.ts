import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatDateService {

  constructor() { }

  /**
   * Formatea una cadena de fecha en formato 'dd-mm-yyyy'.
   * @param dateString - La cadena de fecha en formato ISO o similar.
   * @returns La fecha formateada o "Formato inválido" si la entrada no es válida.
   */
  formatDateString(dateString: string): string {
    if (!dateString || dateString.trim() === '') {
      return "Formato inválido";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Formato inválido";
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  /**
   * Convierte una hora en formato de 24 horas a formato de 12 horas con AM/PM.
   * @param hour - La cadena de hora en formato 'HH:mm'.
   * @returns La hora formateada o "Formato inválido" si la entrada no es válida.
   */
  formatHour(hour: string): string {
    if (!hour || hour.trim() === '') {
      return "Formato inválido";
    }

    const [hours, minutes] = hour.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return "Formato inválido";
    }

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  /**
   * Combina fecha y hora en formato 'dd-mm-yyyy hh:mm AM/PM'.
   * @param dateString - La cadena de fecha en formato ISO o similar.
   * @returns La fecha y hora formateadas o "Formato inválido" si la entrada no es válida.
   */
  dateTime(dateString: string): string {
    if (!dateString || dateString.trim() === '') {
      return "Formato inválido";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Formato inválido";
    }

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  /**
   * Formatea una fecha en formato 'día de mes de año'.
   * @param date - Objeto Date.
   * @returns La fecha formateada en español o "Formato inválido" si la entrada no es válida.
   */
  formatearFechaMes(date: Date): string {
    if (!date) {
      return "Formato inválido";
    }

    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const month = meses[monthIndex];
    return `${day} de ${month} de ${year}`;
  }

  /**
   * Calcula el tiempo transcurrido desde una fecha dada en formato relativo.
   * @param date - Objeto Date.
   * @returns El tiempo transcurrido en formato relativo o "Formato inválido" si la entrada no es válida.
   */
  timeAgo(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return "Formato inválido";
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return `hace ${seconds} segundo${seconds !== 1 ? 's' : ''}`;
    } else if (minutes < 60) {
      return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (days < 30) {
      return `hace ${days} día${days !== 1 ? 's' : ''}`;
    } else if (months < 12) {
      return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
    } else {
      return `hace ${years} año${years !== 1 ? 's' : ''}`;
    }
  }
}
