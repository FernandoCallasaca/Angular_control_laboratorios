export interface Equipos {
    id_equipo: number;
    producto: string;
    modelo: string;
    marca: string;
    estado: string;
    ubicacion: number;
}

export interface EquiposEditar{
    equipo: Equipos;
}