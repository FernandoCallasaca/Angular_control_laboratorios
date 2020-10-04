//Importar modulos de router de angular
import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';


//import
import { LoginComponent } from './component/seguridad/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent} from './component/general/home/home.component';
import { MapaComponent} from './component/general/mapa/mapa.component';
import { ResumenComponent} from './component/general/resumen/resumen.component';
import { DashboadComponent} from './component/general/dashboad/dashboad.component';
import { EntidadComponent } from './component/general/entidad/entidad.component';
import { UsuarioubigeoComponent } from './component/general/usuarioubigeo/usuarioubigeo.component';
import { ElementogrupoComponent } from './component/general/elementogrupo/elementogrupo.component';
import { MapareclamosComponent } from './component/general/mapareclamos/mapareclamos.component';
import { ElementoprocedenciaComponent } from './component/general/elementoprocedencia/elementoprocedencia.component';
import { ElementoespecificacionComponent } from './component/general/elementoespecificacion/elementoespecificacion.component';
import { AtributoComponent } from './component/general/atributo/atributo.component';
import { SoportetipoComponent } from './component/general/soportetipo/soportetipo.component';
import { FormatomantenimientoComponent } from './component/general/formatomantenimiento/formatomantenimiento.component';
import { FormatoinventarioComponent } from './component/general/formatoinventario/formatoinventario.component';
import { FormatoReclamoComponent } from './component/general/formato-reclamo/formato-reclamo.component';
import { RepartoComponent } from './component/general/reparto/reparto.component';
import { RepartomasivoComponent } from './component/general/repartomasivo/repartomasivo.component';
import { RoboSiniestroFormatoComponent } from './component/general/robo-siniestro-formato/robo-siniestro-formato.component';
import { ReconexionCorteFormatoComponent } from './component/general/reconexion-corte-formato/reconexion-corte-formato.component';


import { DocenteComponent } from './component/docente/docente.component';
import { CatalogoComponent } from './component/catalogo/catalogo.component';
import { UserComponent } from './component/user/user.component';

//Array de rutas
const appRoutes:Routes=[
    {path:'',component:DocenteComponent},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'mapa',component:MapaComponent},
    {path:'mapareclamos',component:MapareclamosComponent},
    {path:'resumen',component:ResumenComponent},
    {path:'grafico',component:DashboadComponent},
    {path:'entidad',component:EntidadComponent},
    {path:'usuarioubigeo',component:UsuarioubigeoComponent},
    {path:'dashboard',component:DashboadComponent},
    {path:'elementoprocedencia',component:ElementoprocedenciaComponent},
    {path:'elementogrupo',component:ElementogrupoComponent},
    {path:'elementoespecificacion',component: ElementoespecificacionComponent},
    {path:'atributo',component: AtributoComponent},
    {path:'soportetipo',component:SoportetipoComponent},
    {path:'formato',component:FormatomantenimientoComponent},
    {path:'formato2',component:FormatoinventarioComponent},
    {path:'formatoreclamo',component:FormatoReclamoComponent},
    {path:'reparto',component:RepartoComponent},
    {path:'repartomasivo',component:RepartomasivoComponent},
    {path:'robomasivo',component:RoboSiniestroFormatoComponent},
    {path:'reconexioncortemasivo',component:ReconexionCorteFormatoComponent},
    {path:'app',component:AppComponent},




    {path: 'docente', component: DocenteComponent},
    {path: 'catalogo', component: CatalogoComponent},
    {path: 'usuario', component: UserComponent},



    {path:'**',component:DocenteComponent}
]
export const appRoutingProviders: any[] = [];
export const routing1: ModuleWithProviders = RouterModule.forRoot(appRoutes);
