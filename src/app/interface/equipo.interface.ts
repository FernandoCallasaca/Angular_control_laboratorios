export interface Equipos {
    id_equipo: number;
    id_catalogo: string;
    estado: string;
    ubicacion: number;
}

export interface EquiposEditar{
    equipo: Equipos;
}