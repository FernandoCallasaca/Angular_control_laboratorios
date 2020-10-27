import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'; // Para utilizar un formulario reactivo
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { GeneralService } from './../../service/general.service';
import { BaseComponent } from './../base/base.component';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/common/appsettings';

@Component({
  selector: 'app-redactar-informe',
  templateUrl: './redactar-informe.component.html',
  styleUrls: ['./redactar-informe.component.css'],
  providers: [GeneralService]
})
export class RedactarInformeComponent extends BaseComponent implements OnInit {

  soportestecnicos = []; // tabla todos los soportes tecnicos
  idsSoportesTecnicos = []; // tabla de solo ids de soportes tecnicos
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  idST = -1; // VALOR + 1 PARA AGREGAR A LA BASE DE DATOS

  boolS = false; // estado tipo boolean en caso haya o no problemas software
  boolH = false; // ----------------------------------------------- hardware

  vwincidencias = []; // tabla vista incidencias
  idIncidencia = -1;

  disableSelect = new FormControl(false); // para el select de ids_incidencia
  idsIncidenciasPend = []; // tabla de ids de las incidencias pendientes de acuerdo al soporte tecnico elejido

  idEquipo = -1;

  form: FormGroup;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private generalService: GeneralService,
    private formBuilder: FormBuilder
  ) {
    super(snackBar, router);
    this.buildForm();
  }

  ngOnInit() {
    this.getSoporteTecnico();
    this.getIncidencias();
  }

  private _filter(value: string): string[] {
    const filterValue = value;

    return this.idsSoportesTecnicos.filter(option => option.toString().includes(filterValue));
  }

  getSoporteTecnico() {
    const req1 = { };
    this.generalService.getSoporteTecnico(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.soportestecnicos = result.data;
          console.log('Soporte Técnico');
          console.log(this.soportestecnicos);
          this.idsSoportesTecnicos = this.soportestecnicos.map( soporteTec => soporteTec.id_soportetecnico);
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

  cambiarIdST(id: number): void {
    this.idST = id - 1 ;
    console.log('Id Soporte Técnico');
    console.log(this.idST);
    this.getIncidenciaForSoporteTecnico(id);
  }

  cambiarBoolS(value: boolean) {
    this.boolS = value;
    console.log(`¿Cambios Software?: ${this.boolS}`);
  }
  cambiarBoolH(value: boolean) {
    this.boolH = value;
    console.log(`¿Cambios Hardware?: ${this.boolH}`);
  }

  getIncidencias() {
    const req1 = { };
    this.generalService.getIncidencias(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.vwincidencias = result.data;
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

  getIncidenciaForSoporteTecnico(nroST: number) {
    const incidenciasST = this.vwincidencias
    .filter(incidencia => incidencia.id_soportetecnico === nroST && incidencia.estado === 'pendiente');
    this.idsIncidenciasPend = incidenciasST.map(inc => inc.id_incidencia);
  }

  selectIncidencia(idincidencia: number) {
    this.idIncidencia = idincidencia;
    console.log(`Incidencia: ${this.idIncidencia} `);
    this.idEquipo = this.vwincidencias.filter(incidencia => incidencia.id_incidencia === idincidencia).map(inc => inc.id_equipo)[0];
    console.log(`Equipo de la Incidencia: ${this.idEquipo}`);
  }









  private buildForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      price: [0, [Validators.required]],
      image: '',
      description: ['', [Validators.required]]
    });
  }

  saveProducts(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
