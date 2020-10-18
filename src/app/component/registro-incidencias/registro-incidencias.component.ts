import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { GeneralService } from './../../service/general.service';
import { BaseComponent } from './../base/base.component';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/common/appsettings';

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

  descripcion: String = '';


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

  AlertaGuardadoElemento() {
    // Preguntamos si desea Guardar el Registro
    const mensaje = confirm('¿Te gustaría Guardar la Incidencia?');
    // Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardarIncidencia();
      this.openSnackBar('Incidencia Guardada', 99);
    }
  }

  guardarIncidencia() {
    const req = {
      id_docente: this.idDoc,
      id_equipo: this.idEquipo,
      id_motivo: this.idMotivo,
      descripcion: this.descripcion
    };
    this.generalService.saveIncidencia(req, this.getToken().token).subscribe(
      result => {
        console.log('Entro');
        if (result.estado) {
          console.log('Se guardó correctamente la incidencia');
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
    console.log(`Docente: ${this.idDoc + 1}`);
    console.log(`Laboratorio: ${this.idLab}`);
    console.log(`Equipo: ${this.idEquipo}`);
    console.log(`Motivo: ${this.idMotivo}`);
    console.log(`Descripción: ${this.descripcion}`);
  }
}
