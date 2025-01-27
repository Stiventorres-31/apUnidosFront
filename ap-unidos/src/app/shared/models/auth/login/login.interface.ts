export interface Role_login {
    id: number;
    nombre: string;
}

export interface User_login {
    id: number;
    numero_identificacion: string;
    nombre_completo: string;
    rol_usuario: string;
    estado: string;
}

export interface response_login {
    isError: boolean;
    code: number;
    result: data_response_login
    message: string;
}

export interface data_response_login {
    user: User_login;
    token: string;
}

