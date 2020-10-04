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
} from '../../base/base.component';
import {
  Router
} from '@angular/router';
import {
  AppSettings
} from '../../../common/appsettings';

import {
  SoporteTipo,
  SoporteTipoEditar
} from '../../../interface/soportetipo.interface';
import {
  ResultadoApi
} from '../../../interface/common.interface';

import {
  GeneralService
} from '../../../service/general.service';

@Component({
  selector: 'app-soportetipoeditar',
  templateUrl: './soportetipoeditar.component.html',
  styleUrls: ['./soportetipoeditar.component.css'],
  providers: [GeneralService]
})
export class SoportetipoeditarComponent extends BaseComponent implements OnInit {

  soportetipo: SoporteTipo;
  editar: boolean;
  identidad = 0;

  constructor(public dialogRef: MatDialogRef < SoportetipoeditarComponent > ,
    private _general_services: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: SoporteTipoEditar,
    public _router: Router,
    public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data.soportetipo == null) {
      this.editar = false;
      this.soportetipo = {
        n_idins_soportetipo: 0,
        c_valor: '',
        c_descripcion: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.soportetipo = this.data.soportetipo;

    }
    console.log('Contenido de soportetipo');
    console.log(this.soportetipo);
  }

  guardar(newForm) {
    this.soportetipo;
    this._general_services.saveSoporteTipo(this.soportetipo, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.soportetipo
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
