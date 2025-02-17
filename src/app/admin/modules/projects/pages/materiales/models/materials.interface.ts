import { invetario } from '../../../../../../shared/models/inventory/inventory.interface';
import { ApiResponse, Usuario } from '../../../../../../shared/models/users/users.interface';
import { inmueble } from '../../inmuebles/models/inmuebles.interface';

export interface materials {
    id: number;
    referencia_material: string;
    nombre_material: string;
    numero_identificacion: string;
    estado: string;
    inventarios?: invetario[];
}

export interface form_materials {
    id: number;
    referencia_material: string;
    nombre_material: string;
    costo: string;
    cantidad: number;
    nit_proveedor: string;
    descripcion_proveedor: string;
}

export interface form_inventario {
    id?: number;
    materiale_id: number;
    consecutivo: number;
    costo_material: string;
    cantidad?: number;
    cantidad_material?: number
}

export interface form_lot {
    id?: number;
    materiale_id?: string;
    costo: string;
    cantidad: number;
    nit_proveedor: string;
    nombre_proveedor: string;
    descripcion_proveedor: string;
}


export interface form_budget {
    referencia_material: string;
    inmueble_id: number;
    materiales: form_inventario[];
}

export interface form_update_budget {
    referencia_material: string;
    inmueble_id: number;
    codigo_proyecto: string;
    cantidad_material: number;
    costo_material: string;
}

export interface dd {
    id: number;
    nombre_tipo_inmueble: string;
}

export type MaterialsResponse = ApiResponse<{ materiales: materials[] }>;
export type MaterialResponse = ApiResponse<{ materiale: materials }>;
export type InventarioResponse = ApiResponse<{ inventario: invetario }>;