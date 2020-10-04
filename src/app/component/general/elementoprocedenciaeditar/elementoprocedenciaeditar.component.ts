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
  ElementoProcedencia,
  ElementoProcedenciaEditar
} from '../../../interface/elementoprocedencia.interface';
import {
  ResultadoApi
} from '../../../interface/common.interface';

import {
  GeneralService
} from '../../../service/general.service';


@Component({
  selector: 'app-elementoprocedenciaeditar',
  templateUrl: './elementoprocedenciaeditar.component.html',
  styleUrls: ['./elementoprocedenciaeditar.component.css'],
  providers: [GeneralService]
})
export class ElementoprocedenciaeditarComponent extends BaseComponent implements OnInit {
  elementoprocedencia: ElementoProcedencia;
  editar: boolean;
  identidad = 0;

  constructor(public dialogRef: MatDialogRef < ElementoprocedenciaeditarComponent > ,
    private _general_services: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: ElementoProcedenciaEditar,
    public _router: Router,
    public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data.elementoprocedencia == null) {
      this.editar = false;
      this.elementoprocedencia = {
        n_idins_elementoprocedencia: 0,
        c_valor: '',
        c_descripcion: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.elementoprocedencia = this.data.elementoprocedencia;

    }
    console.log('Contenido de entidad');
    console.log(this.elementoprocedencia);
  }

  guardar(newForm) {
    this.elementoprocedencia;
    this._general_services.saveElementoProcedencia(this.elementoprocedencia, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.elementoprocedencia
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
