import { pagination_interface } from "../pagination/pagination.interface";
import { ApiResponse, Usuario } from "../users/users.interface";

export interface projects {
    id: number;
    codigo_proyecto: string;
    departamento_proyecto: string;
    ciudad_municipio_proyecto: string;
    direccion_proyecto: string;
    numero_identificacion: string;
    fecha_inicio_proyecto: string;
    fecha_final_proyecto: string;
    inmuebles?: any[];
    total_presupuesto?: string;
    total_asignacion?: string;
    usuario?: Usuario;
    estado: string;
}

export interface projectsForm {
    id?: number;
    codigo_proyecto: string;
    departamento_proyecto: string;
    ciudad_municipio_proyecto: string;
    direccion_proyecto: string;
    fecha_inicio_proyecto: string;
    fecha_final_proyecto: string;
}

export interface selectProjects {
    id: string;
    codigo_proyecto: string;
}

export type ProjectResponse = ApiResponse<{ proyecto: projects }>;
export type ProjectsResponse = ApiResponse<{ proyectos: pagination_interface }>;
export type ProjectsResponse_ = ApiResponse<{ proyectos: projects[] }>;
export type ProjectSelectsResponse = ApiResponse<selectProjects[]>;