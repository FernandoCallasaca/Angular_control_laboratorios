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
  selector: 'app-equipoeditar',
  templateUrl: './equipoeditar.component.html',
  styleUrls: ['./equipoeditar.component.css'],
  providers: [GeneralService]
})
export class EquipoeditarComponent implements OnInit {

  equipo = [];

  estado =  [{
      value: 'activo',
      viewValue: 'Activo'
    },
    {
      value: 'mantenimiento',
      viewValue: 'Mantenimiento'
    }
  ];

  ubicacion = [
    { value: 'LAB-301', viewValue: 'LAB-301' },
    { value: 'LAB-302', viewValue: 'LAB-302' },
    { value: 'LAB-303', viewValue: 'LAB-303' },
    { value: 'LAB-304', viewValue: 'LAB-304' },
    { value: 'LAB-305', viewValue: 'LAB-305' },
    { value: 'LAB-306', viewValue: 'LAB-306' },
    { value: 'LAB-307', viewValue: 'LAB-307' },
    { value: 'LAB-308', viewValue: 'LAB-308' },
    { value: 'LAB-309', viewValue: 'LAB-309' },
    { value: '0', viewValue: 'Almacen' },
  ];


  equipo: Equipo;

  editar: boolean;

  identidad = 0;

  constructor(public dialogRef: MatDialogRef < EquipoeditarComponent >,
              private _general_services: GeneralService,
              @Inject(MAT_DIALOG_DATA) public data: EquipoEditar,
              public _router: Router,
              public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    if (this.data.equipo == null) {
      this.editar = false;
      this.equipo = {
        id_equipo: 0,
        id_catalogo: '',
        estado: '',
        ubicacion: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.equipo = this.data.equipo;

    }
  }

  AlertaGuardadoElemento( newForm ) {
    // Preguntamos si desea Guardar el Registro
    const mensaje = confirm('¿Te gustaría Guardar el Equipo?');
    // Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardar(newForm);
      this.openSnackBar('Equipo Guardado', 99);
    }
  }

  guardar( newForm ) {
    this._general_services.saveEquipo(this.equipo, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.equipo
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
