export interface SoporteTecnicos {
    id_soportetecnico: number;
    nombres: string;
    apellidos: string;
    dni: string;
    telefono: string;
    correo: string;
}

export interface SoportesTecnicosEditar{
    soportetecnico: SoporteTecnicos;
}
