export interface SoporteTecnicos {
    id_docente: number;
    nombres: string;
    apellidos: string;
    dni: string;
    telefono: string;
    correo: string;
    condicion: string;
    regimen: string;
    categoria: string;
}

export interface SoportesTecnicosEditar{
    soportetecnico: SoporteTecnicos;
}