export interface Usuario {
    id: number;
    numero_identificacion: number;
    nombre_completo: string;
    rol_usuario: string;
    estado: string;
}
export interface UsuarioForm {
    id?: number;
    numero_identificacion: number;
    nombre_completo: string;
    rol_usuario: Rol;
    password?: string;
    password_confirmation?: string;
}

export interface UsuarioPassword {
    numero_identificacion: number;
    new_password: string;
    new_password_confirmation: string;
}

export interface Rol {
    id: number;
    name: string;
}

export interface ApiResponse<T> {
    isError: boolean;
    code: number;
    message: string;
    result: T;
}


export type UsuarioResponse = ApiResponse<{ usuario: Usuario }>;
export type UsuariosResponse = ApiResponse<{ usuarios: Usuario[] }>;