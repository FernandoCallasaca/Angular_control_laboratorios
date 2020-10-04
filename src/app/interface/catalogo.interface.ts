export interface Catalogos {
    id_catalogo: number;
    tipo: string;
    producto: string;
    modelo: string;
    marca: string;
    caracteristica: string;
}

export interface CatalogosEditar{
    catalogo: Catalogos;
}