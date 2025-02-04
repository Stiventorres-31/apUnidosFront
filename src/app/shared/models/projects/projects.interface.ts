import { ApiResponse } from "../users/users.interface";

export interface projects {
    id: number;
    codigo_proyecto: string;
    departamento_proyecto: string;
    ciudad_municipio_proyecto: string;
    direccion_proyecto: string;
    numero_identificacion: string;
    fecha_inicio_proyecto: string;
    fecha_final_proyecto: string;
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

export type ProjectResponse = ApiResponse<{ proyecto: projects }>;
export type ProjectsResponse = ApiResponse<{ proyectos: projects[] }>;