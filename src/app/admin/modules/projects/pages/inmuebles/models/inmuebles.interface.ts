import { ApiResponse, Usuario } from '../../../../../../shared/models/users/users.interface';

export interface tipo_inmueble {
    id: number;
    nombre_tipo_inmueble: string;
    numero_identificacion: string;
    estado: string;
    Usuario: Usuario;
}

export interface inmueble {
    id: number;
    codigo_proyecto: string;
    tipo_inmueble: tipo_inmueble;
    presupuestos?: any[];
    asignaciones?: any[];
    estado: string;

}



export interface tipo_inmueble_form {
    id: number;
    nombre_tipo_inmueble: string;
}


export type InmueblesResponse = ApiResponse<{ inmuebles: inmueble[] }>;
export type InmuebleResponse = ApiResponse<{ inmueble: inmueble }>;

export type TipoInmueblesResponse = ApiResponse<{ tipo_inmuebles: tipo_inmueble[] }>;
export type TipoInmuebleResponse = ApiResponse<{ tipo_inmueble: tipo_inmueble }>;