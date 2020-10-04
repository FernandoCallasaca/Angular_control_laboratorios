export interface Periodo {
    n_idgen_periodo: number;
    n_mes: number;
    n_annio: number;
    c_descripcion: string;
}

export interface PeriodoEditar{
    periodo: Periodo;
}