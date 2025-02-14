import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtro',
    standalone: true,
    pure: false // Cambiar a false para garantizar que se vuelva a calcular en cada cambio
})

export class filter_ngx implements PipeTransform {
    transform(items: any[], term: string): any[] {
        if (!term || !items) return items; // Si no hay término de búsqueda o no hay elementos, devuelve los elementos sin filtrar
    
        // Divide el término de búsqueda en palabras individuales
        const terms = term.toLowerCase().split(' ').filter(t => t.trim()); // Elimina términos vacíos
    
        return items.filter(item => {
            let found = false; // Variable que indicará si encontramos alguna palabra en cualquier campo
    
            // Verifica si alguna palabra del término de búsqueda coincide en cualquier propiedad del objeto
            for (let key in item) {
                if (typeof item[key] === 'string') {
                    // Busca coincidencias en campos de texto
                    found = terms.some(word => item[key].toLowerCase().includes(word));
                } else if (typeof item[key] === 'number') {
                    // Busca coincidencias en campos numéricos
                    found = terms.some(word => item[key].toString().includes(word));
                } else if (Array.isArray(item[key])) {
                    // Busca coincidencias dentro de arrays
                    for (let arrayItem of item[key]) {
                        if (typeof arrayItem === 'string') {
                            found = terms.some(word => arrayItem.toLowerCase().includes(word));
                        } else if (typeof arrayItem === 'number') {
                            found = terms.some(word => arrayItem.toString().includes(word));
                        }
                        if (found) break; // Si encuentra, detiene la búsqueda en este array
                    }
                } else if (typeof item[key] === 'object') {
                    // Busca coincidencias dentro de objetos anidados
                    for (let nestedKey in item[key]) {
                        if (typeof item[key][nestedKey] === 'string') {
                            found = terms.some(word => item[key][nestedKey].toLowerCase().includes(word));
                        } else if (typeof item[key][nestedKey] === 'number') {
                            found = terms.some(word => item[key][nestedKey].toString().includes(word));
                        }
                        if (found) break; // Si encuentra, detiene la búsqueda en este objeto
                    }
                }
    
                if (found) break; // Si encuentra, detiene la búsqueda en este item
            }
    
            return found; // Retorna el resultado final si alguna palabra encontró coincidencia
        });
    }
    

}