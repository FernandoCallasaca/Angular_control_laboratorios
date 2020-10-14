import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { GeneralService } from './../../service/general.service';
import { BaseComponent } from './../base/base.component';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/common/appsettings';



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
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
  selector: 'app-registro-incidencias',
  templateUrl: './registro-incidencias.component.html',
  styleUrls: ['./registro-incidencias.component.css'],
  providers: [GeneralService]
})
export class RegistroIncidenciasComponent extends BaseComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  idDoc = -1;
  docentes = [];
  iddocentes = [];

  idLab = -1;
  disableSelect = new FormControl(false);
  laboratorios = [];

  idEquipo = -1;
  equipos = [];
  eqLab = [];

  idMotivo = -1;
  motivos = [];
  descripcionMotivos = [];

  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private generalService: GeneralService
  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.getDocentes();
    this.getLaboratorios();
    this.getMotivosIncidencia();
  }

  private _filter(value: string): string[] {
    const filterValue = value;

    return this.iddocentes.filter(option => option.toString().includes(filterValue));
  }

  getDocentes() {
    const req1 = { };
    this.generalService.getDocente(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.docentes = result.data;
          console.log('Docentes');
          console.log(this.docentes);
          this.iddocentes = this.docentes.map( docente => docente.id_docente);
          this.filteredOptions = this.myControl.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
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

  cambiarIdDoc(id: number): void {
    this.idDoc = id - 1;
  }

  getLaboratorios() {
    const req1 = { };
    this.generalService.getEquipo(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.equipos = result.data;
          const distinto = (valor, indice, self) => {
            return self.indexOf(valor) === indice;
          };
          this.laboratorios = this.equipos.map(equipo => equipo.ubicacion).filter(distinto).sort();
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

  cambiarIdLab(id: number): void {
    this.idLab = id;
    this.getEquiposForLabos(id);
  }

  getEquiposForLabos(nrolab: number) {
    const equiposLabo = this.equipos.filter(equipo => equipo.ubicacion === nrolab);
    this.eqLab = equiposLabo.map(eq => eq.id_equipo).sort();
  }

  selectEquipo(idequipo: number) {
    this.idEquipo = idequipo;
  }

  getMotivosIncidencia() {
    const req1 = { };
    this.generalService.getMotivosIncidencia(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.motivos = result.data;
          console.log(this.motivos);
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

  cambiarIdMotivo(idmotivo: number) {
    this.idMotivo = idmotivo;
  }

  guardarIncidencia() {
    console.log(`Docente ${this.idDoc + 1}`);
    console.log(`Laboratorio ${this.idLab}`);
    console.log(`Equipo ${this.idEquipo}`);
    console.log(`Motivo ${this.idMotivo}`);
  }

}
