import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BaseComponent } from '../../base/base.component';
import { Router } from "@angular/router";
import { AppSettings } from '../../../common/appsettings';

import { Entidad, EntidadEditar } from '../../../interface/entidad.interface';
import { ResultadoApi} from '../../../interface/common.interface';

import { GeneralService } from '../../../service/general.service';


@Component({
  selector: 'app-entidadeditar',
  templateUrl: './entidadeditar.component.html',
  styleUrls: ['./entidadeditar.component.css'],
  providers: [GeneralService]
})
export class EntidadeditarComponent extends BaseComponent implements OnInit {
  entidad: Entidad;
  editar: boolean;
  identidad = 0;

  constructor(public dialogRef: MatDialogRef<EntidadeditarComponent>,
    private _general_services: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: EntidadEditar,
    public _router: Router,
    public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data.entidad == null) {
      this.editar = false;
      this.entidad = {
        n_idgen_entidad: 0,
        c_name: ""
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.entidad = this.data.entidad;
      
    }
    console.log('Contenido de entidad');
    console.log(this.entidad);
  }

  guardar(newForm) {
    this.entidad;
    this._general_services.save(this.entidad, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log('Respuesta: ' + result.data);
            this.dialogRef.close({ flag: true, data: this.entidad });
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
