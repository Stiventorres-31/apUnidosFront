import { invetario } from '../../../../../../shared/models/inventory/inventory.interface';
import { ApiResponse, Usuario } from '../../../../../../shared/models/users/users.interface';

export interface materials {
    id: number;
    referencia_material: string;
    nombre_material: string;
    numero_identificacion: string;
    estado: string;
    inventario?: invetario[];
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
    referencia_material: string;
    consecutivo: number;
    costo_material: string;
    cantidad: number;
}

export interface form_lot {
    referencia_material: string;
    costo: string;
    cantidad: number;
    nit_proveedor: string;
    nombre_proveedor: string;
    descripcion_proveedor: string;
}


export interface dd {
    id: number;
    nombre_tipo_inmueble: string;
}

export type MaterialsResponse = ApiResponse<{ materiale: materials[] }>;
export type MaterialResponse = ApiResponse<{ material: materials }>;
export type InventarioResponse = ApiResponse<{ inventario: invetario[] }>;