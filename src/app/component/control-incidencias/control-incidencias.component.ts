import {Component, OnInit} from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { GeneralService } from './../../service/general.service';
import { BaseComponent } from './../base/base.component';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/common/appsettings';

export interface Incidencia {
  id_incidencia: number;
  id_docente: number;
  docente: string;
  laboratorio: string;
  equipo: string;
  fecha: string;
  motivo: string;
  asignado: number;
  estado: string;
  soportetecnico: string;
}

@Component({
  selector: 'app-control-incidencias',
  templateUrl: './control-incidencias.component.html',
  styleUrls: ['./control-incidencias.component.css'],
  providers: [{
    provide: [STEPPER_GLOBAL_OPTIONS],
    useValue: {displayDefaultIndicatorType: false},
  }, GeneralService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ControlIncidenciasComponent extends BaseComponent implements OnInit {

  incidencias = [];
  incidendiasSinAsignar: Incidencia[] = [];
  incidenciasAsigandas: Incidencia[] = [];

  dataSource = this.incidendiasSinAsignar;
  dataSource1 = this.incidenciasAsigandas;

  columnsToDisplay = ['id_incidencia', 'fecha', 'laboratorio', 'equipo'];
  expandedElement: Incidencia | null;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private generalService: GeneralService
  ) {
    super(snackBar, router);
    this.getIncidencias();
  }

  ngOnInit() {
  }

  getIncidencias() {
    const req1 = { };
    this.generalService.getIncidencias(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.incidencias = result.data;
          this.dataSource = this.incidencias.filter(incidencia => incidencia.asignado === 0);
          this.dataSource1 = this.incidencias.filter(incidencia => incidencia.asignado !== 0);
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
}
