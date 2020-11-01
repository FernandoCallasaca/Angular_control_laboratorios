import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import {
  BaseComponent
} from '../base/base.component';
import {
  Router
} from '@angular/router';
import {
  AppSettings
} from '../../common/appsettings';

import {
  Docentes,
  DocentesEditar
} from '../../interface/docente.interface';
import {
  ResultadoApi
} from '../../interface/common.interface';

import {
  GeneralService
} from '../../service/general.service';

@Component({
  selector: 'app-docenteeditar',
  templateUrl: './docenteeditar.component.html',
  styleUrls: ['./docenteeditar.component.css'],
  providers: [GeneralService]
})

export class DocenteeditarComponent extends BaseComponent implements OnInit {


  docentes = [];

  condiciones =  [{
      value: 'nombrado',
      viewValue: 'Nombrado'
    },
    {
      value: 'contratado',
      viewValue: 'Contratado'
    }
  ];

  regimenes =  [{
      value: 'tiempo completo',
      viewValue: 'TC'
    },
    {
      value: 'tiempo parcial',
      viewValue: 'TP'
    }
  ];

  nombrado =  [
    { value: 'principal', viewValue: 'Principal' },
    { value: 'auxiliar', viewValue: 'Auxiliar' },
    { value: 'asociado', viewValue: 'Asociado' },
    { value: 'jefe de practica', viewValue: 'Jefe de Práctica' },
  ];

  contratado = [
    { value: 'A1', viewValue: 'A1' },
    { value: 'A2', viewValue: 'A2' },
    { value: 'A3', viewValue: 'A3' },
    { value: 'B1', viewValue: 'B1' },
    { value: 'B2', viewValue: 'B2' },
    { value: 'B3', viewValue: 'B3' },
    { value: 'jefe de practica', viewValue: 'Jefe de Práctica' },
  ];

  nombreCategoria = [
    { value: 'principal', viewValue: 'Principal' },
    { value: 'auxiliar', viewValue: 'Auxiliar' },
    { value: 'asociado', viewValue: 'Asociado' },
    { value: 'jefe de practica', viewValue: 'Jefe de Práctica' },
    { value: 'A1', viewValue: 'A1' },
    { value: 'A2', viewValue: 'A2' },
    { value: 'A3', viewValue: 'A3' },
    { value: 'B1', viewValue: 'B1' },
    { value: 'B2', viewValue: 'B2' },
    { value: 'B3', viewValue: 'B3' },
  ];

  activarCategoria = true;

  docente: Docentes;

  editar: boolean;

  identidad = 0;

  constructor(public dialogRef: MatDialogRef < DocenteeditarComponent >,
              private _general_services: GeneralService,
              @Inject(MAT_DIALOG_DATA) public data: DocentesEditar,
              public _router: Router,
              public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    if (this.data.docente == null) {
      this.editar = false;
      this.docente = {
        id_docente: 0,
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        correo: '',
        condicion: '',
        regimen: '',
        categoria: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.docente = this.data.docente;

    }
  }

  AlertaGuardadoElemento( newForm ) {
    // Preguntamos si desea Guardar el Registro
    const mensaje = confirm('¿Te gustaría Guardar el Docente?');
    // Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardar(newForm);
      this.openSnackBar('Docente Guardado', 99);
    }
  }

  guardar( newForm ) {
    this._general_services.saveDocente(this.docente, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.docente
            });
          } else {
            this.openSnackBar(result.mensaje, 99);
          }
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      }, error => {
        console.error(error);
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }
  selectCategoria(nombre) {
    this.activarCategoria = false;
    if (nombre === 'contratado') {
      this.nombreCategoria = this.contratado;
    } else {
      this.nombreCategoria = this.nombrado;
    }
  }
}
