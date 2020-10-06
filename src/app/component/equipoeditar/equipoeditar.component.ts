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
  Equipos,
  EquiposEditar
} from '../../interface/equipo.interface';
import {
  ResultadoApi
} from '../../interface/common.interface';

import {
  GeneralService
} from '../../service/general.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-equipoeditar',
  templateUrl: './equipoeditar.component.html',
  styleUrls: ['./equipoeditar.component.css'],
  providers: [GeneralService]
})

export class EquipoeditarComponent extends BaseComponent implements OnInit {
  
  equipos = [];

  estados =  [{
      value: 'activo',
      viewValue: 'Activo'
    },
    {
      value: 'mantenimiento',
      viewValue: 'Mantenimiento'
    }
  ];

  myControl: FormControl = new FormControl();
  ubicaciones = [
    { value: 1, viewValue: 'LAB-301' },
    { value: 2, viewValue: 'LAB-302' },
    { value: 3, viewValue: 'LAB-303' },
    { value: 4, viewValue: 'LAB-304' },
    { value: 5, viewValue: 'LAB-305' },
    { value: 6, viewValue: 'LAB-306' },
    { value: 7, viewValue: 'LAB-307' },
    { value: 8, viewValue: 'LAB-308' },
    { value: 9, viewValue: 'LAB-309' },
    { value: 0, viewValue: 'Almacen' },
  ];

  
  equipo: Equipos;

  editar: boolean;

  identidad = 0;

  constructor(public dialogRef: MatDialogRef < EquipoeditarComponent >,
              private _general_services: GeneralService,
              @Inject(MAT_DIALOG_DATA) public data: EquiposEditar,
              public _router: Router,
              public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    if (this.data.equipo == null) {
      this.editar = false;
      this.equipo = {
        id_equipo: 0,
        producto:'',
        modelo:'',
        marca:'',
        estado: '',
        ubicacion: 0
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
