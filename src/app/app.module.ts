import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { routing1, appRoutingProviders } from './app.routing';

import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseComponent } from './component/base/base.component';
import { LoginComponent } from './component/seguridad/login/login.component';

import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
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
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { FormatomantenimientoComponent } from './component/general/formatomantenimiento/formatomantenimiento.component';
import { FormatoReclamoComponent } from './component/general/formato-reclamo/formato-reclamo.component';
import { DocenteComponent } from './component/docente/docente.component';
import { DocenteeditarComponent } from './component/docenteeditar/docenteeditar.component';
import { CatalogoComponent } from './component/catalogo/catalogo.component';
import { CatalogoeditarComponent } from './component/catalogoeditar/catalogoeditar.component';
import { UserComponent } from './component/user/user.component';
import { UsereditComponent } from './component/useredit/useredit.component';
import { SoportetecnicoComponent } from './component/soportetecnico/soportetecnico.component';
import { SoportetecnicoeditarComponent } from './component/soportetecnicoeditar/soportetecnicoeditar.component';
import { EquipoComponent } from './component/equipo/equipo.component';
import { EquipoeditarComponent } from './component/equipoeditar/equipoeditar.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { RegistroIncidenciasComponent } from './component/registro-incidencias/registro-incidencias.component';
import { ControlIncidenciasComponent } from './component/control-incidencias/control-incidencias.component';
import { AsignarIncidenciasComponent } from './component/asignar-incidencias/asignar-incidencias.component';
import { RedactarInformeComponent } from './component/redactar-informe/redactar-informe.component';
import { AsignarcomponenteComponent } from './component/asignarcomponente/asignarcomponente.component';
import { IncidenciaEntreFechasComponent } from './component/incidencia-entre-fechas/incidencia-entre-fechas.component';

import { MatNativeDateModule } from '@angular/material';
// import { MatMomentDateModule } from "@angular/material-moment-adapter";
@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    ResumenComponent,
    DashboadComponent,
    SnackComponent,
    ResetearclaveComponent,
    ConfirmarComponent,
    FormatomantenimientoComponent,
    FormatoReclamoComponent,
    DocenteComponent,
    DocenteeditarComponent,
    CatalogoComponent,
    CatalogoeditarComponent,
    UserComponent,
    UsereditComponent,
    SoportetecnicoComponent,
    SoportetecnicoeditarComponent,
    EquipoComponent,
    EquipoeditarComponent,
    RegistroIncidenciasComponent,
    ControlIncidenciasComponent,
    AsignarIncidenciasComponent,
    RedactarInformeComponent,
    AsignarcomponenteComponent,
    IncidenciaEntreFechasComponent,
  ],
  imports: [
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
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
    MatAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDpcWweoH2IqPSGvBX91N46EsIdY-IfNiY'
    })
  ],
  entryComponents:[
    SnackComponent,
    ResetearclaveComponent,
    DocenteeditarComponent,
    CatalogoeditarComponent,
    UsereditComponent,
    SoportetecnicoeditarComponent,
    EquipoeditarComponent
  ],
  providers: [appRoutingProviders, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
