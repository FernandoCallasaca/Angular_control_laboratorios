export interface Usuario {
    n_idseg_user: number;
    c_username: String;
    c_name:String; 
    c_lastname:String;
    c_phone:String; 
    c_documentid:String;

    c_password:String;
    c_repassword:String;
    n_idseg_role:number,
    n_idgen_entidad:number
}

export interface Role{
    n_idseg_role:number,
    c_role:String
}

export interface Entidad{
    n_idgen_entidad:number,
    c_name:String
}

export interface ResetarClave {
    data: Usuario,
    titulo: string,
    esresetpassword: boolean
}

export interface UsuarioEditar{
    usuario:Usuario,
    roles:Role[],
    entidades:Entidad[],

}