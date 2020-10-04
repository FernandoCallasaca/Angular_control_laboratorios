export interface ElementoEspecificacion {
    n_idins_elementoespecificacion: number,
    n_idins_elementogrupo: number;
    c_tipo: string;
    c_marca: string;
    c_modelo: string;
}

export interface ElementoEspecificacionEditar {
    elementoespecificacion: ElementoEspecificacion;
}
