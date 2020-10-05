//Importar modulos de router de angular
import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';


//import
import { LoginComponent } from './component/seguridad/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent} from './component/general/home/home.component';
import { ResumenComponent} from './component/general/resumen/resumen.component';
import { DashboadComponent} from './component/general/dashboad/dashboad.component';
import { FormatomantenimientoComponent } from './component/general/formatomantenimiento/formatomantenimiento.component';
import { FormatoReclamoComponent } from './component/general/formato-reclamo/formato-reclamo.component';


import { DocenteComponent } from './component/docente/docente.component';
import { CatalogoComponent } from './component/catalogo/catalogo.component';
import { UserComponent } from './component/user/user.component';
import { SoportetecnicoComponent } from './component/soportetecnico/soportetecnico.component';
import { EquipoComponent } from './component/equipo/equipo.component';

//Array de rutas
const appRoutes:Routes=[
    {path:'',component:DocenteComponent},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'resumen',component:ResumenComponent},
    {path:'grafico',component:DashboadComponent},
    {path:'dashboard',component:DashboadComponent},
    {path:'formato',component:FormatomantenimientoComponent},
    {path:'formatoreclamo',component:FormatoReclamoComponent},
    {path:'app',component:AppComponent},




    {path: 'docente', component: DocenteComponent},
    {path: 'catalogo', component: CatalogoComponent},
    {path: 'usuario', component: UserComponent},
    {path: 'soportetecnico', component: SoportetecnicoComponent},
    {path: 'equipo', component: EquipoComponent},



    {path: '**', component: LoginComponent}
]
export const appRoutingProviders: any[] = [];
export const routing1: ModuleWithProviders = RouterModule.forRoot(appRoutes);
