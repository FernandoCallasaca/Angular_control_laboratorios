import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{FormsModule} from '@angular/forms';
import{HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import{HashLocationStrategy,LocationStrategy} from '@angular/common'
import{routing1,appRoutingProviders} from './app.routing';

import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseComponent } from './component/base/base.component';
import { LoginComponent } from './component/seguridad/login/login.component';

import {MatStepperModule} from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './component/general/home/home.component';
import { MenuComponent } from './component/general/menu/menu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MapaComponent } from './component/general/mapa/mapa.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { ResumenComponent } from './component/general/resumen/resumen.component';
import { DashboadComponent } from './component/general/dashboad/dashboad.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { SnackComponent } from './component/generico/snack/snack.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ResetearclaveComponent } from './component/generico/resetarclave/resetarclave.component';
import { ConfirmarComponent } from './component/generico/confirmar/confirmar.component';
import { EntidadComponent } from './component/general/entidad/entidad.component';
import { EntidadeditarComponent } from './component/general/entidadeditar/entidadeditar.component';
import { UsuarioubigeoComponent } from './component/general/usuarioubigeo/usuarioubigeo.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { ElementogrupoComponent } from './component/general/elementogrupo/elementogrupo.component';
import { ElementogrupoeditarComponent } from './component/general/elementogrupoeditar/elementogrupoeditar.component';
import { MapareclamosComponent } from './component/general/mapareclamos/mapareclamos.component';
import { ElementoprocedenciaComponent } from './component/general/elementoprocedencia/elementoprocedencia.component';
import { ElementoprocedenciaeditarComponent } from './component/general/elementoprocedenciaeditar/elementoprocedenciaeditar.component';
import { ElementoespecificacionComponent } from './component/general/elementoespecificacion/elementoespecificacion.component';
import { ElementoespecificacioneditarComponent } from './component/general/elementoespecificacioneditar/elementoespecificacioneditar.component';
import { AtributoComponent } from './component/general/atributo/atributo.component';
import { AtributoeditarComponent } from './component/general/atributoeditar/atributoeditar.component';
import { SoportetipoComponent } from './component/general/soportetipo/soportetipo.component';
import { SoportetipoeditarComponent } from './component/general/soportetipoeditar/soportetipoeditar.component';
import { FormatomantenimientoComponent } from './component/general/formatomantenimiento/formatomantenimiento.component';
import { FormatoinventarioComponent } from './component/general/formatoinventario/formatoinventario.component';
import { FormatoReclamoComponent } from './component/general/formato-reclamo/formato-reclamo.component';
import { RepartoComponent } from './component/general/reparto/reparto.component';
import { RepartomasivoComponent } from './component/general/repartomasivo/repartomasivo.component';
import { RoboSiniestroFormatoComponent } from './component/general/robo-siniestro-formato/robo-siniestro-formato.component';
import { ReconexionCorteFormatoComponent } from './component/general/reconexion-corte-formato/reconexion-corte-formato.component';
import { DocenteComponent } from './component/docente/docente.component';
import { DocenteeditarComponent } from './component/docenteeditar/docenteeditar.component';
import { CatalogoComponent } from './component/catalogo/catalogo.component';
import { CatalogoeditarComponent } from './component/catalogoeditar/catalogoeditar.component';
import { UserComponent } from './component/user/user.component';
import { UsereditComponent } from './component/useredit/useredit.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    MapaComponent,
    ResumenComponent,
    DashboadComponent,
    SnackComponent,
    ResetearclaveComponent,
    ConfirmarComponent,
    EntidadComponent,
    EntidadeditarComponent,
    UsuarioubigeoComponent,
    ElementogrupoComponent,
    ElementogrupoeditarComponent,
    MapareclamosComponent,
    ElementoprocedenciaComponent,
    ElementoprocedenciaeditarComponent,
    ElementoespecificacionComponent,
    ElementoespecificacioneditarComponent,
    AtributoComponent,
    AtributoeditarComponent,
    SoportetipoComponent,
    SoportetipoeditarComponent,
    FormatomantenimientoComponent,
    FormatoinventarioComponent,
    FormatoReclamoComponent,
    RepartoComponent,
    RepartomasivoComponent,
    RoboSiniestroFormatoComponent,
    ReconexionCorteFormatoComponent,
    DocenteComponent,
    DocenteeditarComponent,
    CatalogoComponent,
    CatalogoeditarComponent,
    UserComponent,
    UsereditComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    routing1,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    AgmJsMarkerClustererModule,
    MatStepperModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDpcWweoH2IqPSGvBX91N46EsIdY-IfNiY'
    })
  ],
  entryComponents:[
    SnackComponent,
    ResetearclaveComponent,
    EntidadeditarComponent,
    ElementoprocedenciaeditarComponent,
    ElementogrupoeditarComponent,
    ElementoespecificacioneditarComponent,
    AtributoeditarComponent,
    SoportetipoeditarComponent,
    DocenteeditarComponent,
    CatalogoeditarComponent,
    UsereditComponent
  ],
  providers: [appRoutingProviders, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
