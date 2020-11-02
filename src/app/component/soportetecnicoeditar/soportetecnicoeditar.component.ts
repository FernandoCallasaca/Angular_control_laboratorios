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
  SoporteTecnicos,
  SoportesTecnicosEditar
} from '../../interface/soportetecnico.interface';
import {
  ResultadoApi
} from '../../interface/common.interface';

import {
  GeneralService
} from '../../service/general.service';


@Component({
  selector: 'app-soportetecnicoeditar',
  templateUrl: './soportetecnicoeditar.component.html',
  styleUrls: ['./soportetecnicoeditar.component.css'],
  providers: [GeneralService]
})
export class SoportetecnicoeditarComponent extends BaseComponent implements OnInit {

  soportestecnicos = [];

  soportetecnico: SoporteTecnicos;

  editar: boolean;

  identidad = 0;


  constructor(public dialogRef: MatDialogRef < SoportetecnicoeditarComponent >,
      private _general_services: GeneralService,
      @Inject(MAT_DIALOG_DATA) public data: SoportesTecnicosEditar,
      public _router: Router,
      public snackBar: MatSnackBar) {
  super(snackBar, _router);
  }

  ngOnInit() {
    if (this.data.soportetecnico == null) {
      this.editar = false;
      this.soportetecnico = {
        id_soportetecnico: 0,
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        correo: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.soportetecnico = this.data.soportetecnico;
    }
  }

  AlertaGuardadoElemento( newForm ) {
    // Preguntamos si desea Guardar el Registro
    const mensaje = confirm('¿Te gustaría Guardar el Soporte Técnico?');
    // Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardar(newForm);
      this.openSnackBar('Soporte Técnico Guardado', 99);
    }
  }

  guardar( newForm ) {
    this._general_services.saveDocente(this.soportetecnico, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.soportetecnico
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
}
