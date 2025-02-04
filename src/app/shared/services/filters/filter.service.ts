import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterNgxService {
  
  // Método para filtrar los elementos
  filtrar(items: any[], term: string): any[] {
    if (!term || !items) return items; // Si no hay término de búsqueda o elementos, devuelve los elementos sin filtrar

    term = term.toLowerCase(); // Convierte el término de búsqueda a minúsculas

    return items.filter(item => {
      for (let key in item) {
        if (typeof item[key] === 'string' && item[key].toLowerCase().includes(term)) {
          return true; // Si coincide con un campo de texto
        } else if (typeof item[key] === 'number' && item[key].toString().toLowerCase().includes(term)) {
          return true; // Si coincide con un campo numérico
        } else if (typeof item[key] === 'object') {
          // Recursividad para objetos anidados
          for (let nestedKey in item[key]) {
            if (typeof item[key][nestedKey] === 'object') {
              for (let subKey in item[key][nestedKey]) {
                if (typeof item[key][nestedKey][subKey] === 'string' && item[key][nestedKey][subKey].toLowerCase().includes(term)) {
                  return true;
                } else if (typeof item[key][nestedKey][subKey] === 'number' && item[key][nestedKey][subKey].toString().toLowerCase().includes(term)) {
                  return true;
                }
              }
            }
          }
        }
      }
      return false; // Si no encuentra coincidencias
    });
  }
}
