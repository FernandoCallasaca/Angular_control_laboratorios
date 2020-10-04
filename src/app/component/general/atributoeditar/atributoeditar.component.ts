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
  Atributos,
  AtributosEditar
} from '../../../interface/atributos.interface';
import {
  ResultadoApi
} from '../../../interface/common.interface';

import {
  GeneralService
} from '../../../service/general.service';

@Component({
  selector: 'app-atributoeditar',
  templateUrl: './atributoeditar.component.html',
  styleUrls: ['./atributoeditar.component.css'],
  providers: [GeneralService]
})
export class AtributoeditarComponent extends BaseComponent implements OnInit {

  atributo: Atributos;
  editar: boolean;
  identidad = 0;

  constructor(public dialogRef: MatDialogRef < AtributoeditarComponent > ,
    private _general_services: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: AtributosEditar,
    public _router: Router,
    public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data.atributo == null) {
      this.editar = false;
      this.atributo = {
        n_idins_atributos: 0,
        c_valor: '',
        c_descripcion: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.atributo = this.data.atributo;

    }
    console.log('Contenido de atributo');
    console.log(this.atributo);
  }

  guardar(newForm) {
    this.atributo;
    this._general_services.saveAtributo(this.atributo, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.atributo
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
