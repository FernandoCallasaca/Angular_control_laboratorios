export interface TipoImagen {
    n_idgen_tipoimagen: number;
    c_codigo: string;
    c_nombre: string;
    n_tipo: number;
    n_modulo: number;
}

export interface TipoImageEditar{
    tipoimagen: TipoImagen;
}