import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }


  numeric(valor: string): string {
    return valor.replace(/\D/g, ''); // Devuelve un nuevo valor sin caracteres no numéricos

  }
  alphanumeric(valor: string): string {
    return valor.replace(/[^a-zA-Z0-9]/g, ''); // Devuelve un nuevo valor sin caracteres que no sean letras o números
  }

  alphabetic(valor: string) {
    return valor.replace(/[^a-zA-Z]/g, ''); // Devuelve un nuevo valor sin caracteres que no sean letras
  }

  two_email_in_one(valor: string): boolean { //Valida si hay dos correos en un valor
    const value = valor.trim();
    // Separa los correos por comas espacios o lineas
    const emails = value.split(/[,;\s]+/);

    // comprueba si hay mas de un correo
    if (emails.length > 1) {
      return true;
    } else {
      return false;
    }

  }

  validation_email(valor: string): boolean { //Valida si es un correo valido

    const emailValue = valor.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(emailValue)) {
      return false;
    } else {
      return true;
    }
  }

  validation_length(valor: string, maxLength: number): string {
    if (valor.length >= maxLength) {
      return valor.slice(0, maxLength);
    } else {
      return valor;
    }
  }


  format_moneda(precio: string | number | null | undefined, sig: boolean = true): string {
    // Validar si precio es null, undefined, o un valor inválido
    if (precio == null || precio === '') {
      return sig ? '$0' : '0';
    }

    // Convertir a número
    const precioNumerico = typeof precio === 'string'
      ? parseFloat(precio.replace(/[^0-9.-]+/g, ''))
      : precio;

    // Validar si la conversión dio un número válido
    if (isNaN(precioNumerico) || precioNumerico == null) {
      return sig ? '$0' : '0';
    }

    if (sig) {
      return precioNumerico.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } else {
      return new Intl.NumberFormat('es-CO', {
        useGrouping: true,
        minimumFractionDigits: 0,
      }).format(precioNumerico);
    }
  }


  parseDecimal(value: string | number) {
    if (typeof value === 'string') {
      // Reemplazar puntos con cadenas vacías y convertir a número flotante
      return parseFloat(value.replace(/\./g, ''));
    }
    return value;
  }

}
