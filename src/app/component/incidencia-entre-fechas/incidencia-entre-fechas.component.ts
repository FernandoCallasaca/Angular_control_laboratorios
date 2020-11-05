import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'; // Para utilizar un formulario reactivo
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { GeneralService } from './../../service/general.service';
import { BaseComponent } from './../base/base.component';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/common/appsettings';

import {MatDatepickerInputEvent} from '@angular/material/datepicker';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface incidenciasDosFechas {
  equipo: string;
  laboratorio: string;
  motivo: string;
  soportetecnico: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-incidencia-entre-fechas',
  templateUrl: './incidencia-entre-fechas.component.html',
  styleUrls: ['./incidencia-entre-fechas.component.css'],
  providers: [GeneralService]
})
export class IncidenciaEntreFechasComponent extends BaseComponent implements OnInit {

  docentes = [];
  disableSelect = new FormControl(false);
  idDocente = -1;

  fechaInc: Date;
  fechaFin: Date;

  dateI;
  dateF;

  tablaIncidenciasEntre2Fechas: incidenciasDosFechas[] = [];

  displayedColumns: string[] = ['equipo', 'ubicacion', 'motivo', 'tecnico'];
  dataSource = this.tablaIncidenciasEntre2Fechas;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private generalService: GeneralService,
    private formBuilder: FormBuilder
  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.getDocentes();
  }

  getDocentes() {
    const req1 = { };
    this.generalService.getDocente(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.docentes = result.data;
          console.log('Docentes');
          console.log(this.docentes);
        } else {
          this.openSnackBar(result.mensaje, 99);
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  cambiarIdDocente(idDoc: number): void {
    this.idDocente = idDoc;
    console.log(`Id del docente seleccionado: ${this.idDocente}`);
  }

  fechaInicio(event: MatDatepickerInputEvent<Date>) {
    this.fechaInc = event.value;
    this.dateI = this.fechaInc.getFullYear() + '/' +
    (this.fechaInc.getMonth() + 1) + '/' + this.fechaInc.getDate();
    console.log(this.fechaInc);
    console.log(this.dateI);
  }
  fechaFinal(event: MatDatepickerInputEvent<Date>) {
    this.fechaFin = event.value;
    this.dateF = this.fechaFin.getFullYear() + '/' +
      (this.fechaFin.getMonth() + 1) + '/' + this.fechaFin.getDate();

    console.log(this.fechaFin);
    console.log(this.dateF);
    this.getIncidenciasEntreFechas();
  }

  getIncidenciasEntreFechas() {
    const req = {
      id_docente: this.idDocente,
      fechainicio: this.dateI,
      fechafin: this.dateF
    };
    this.generalService.getIncidenciasEntre2Fechas(req, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.tablaIncidenciasEntre2Fechas = result.data;
            console.log('Incidencias entre las 2 fechas');
            console.log(this.tablaIncidenciasEntre2Fechas);
            this.dataSource = this.tablaIncidenciasEntre2Fechas;
          } else {
            this.openSnackBar(result.mensaje, 99);
          }
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        } finally {
        }
      }, error => {
        this.openSnackBar(error.stack, 99);
      });
  }
}
