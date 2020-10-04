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
  Catalogos,
  CatalogosEditar
} from '../../interface/catalogo.interface';
import {
  ResultadoApi
} from '../../interface/common.interface';

import {
  GeneralService
} from '../../service/general.service';

@Component({
  selector: 'app-catalogoeditar',
  templateUrl: './catalogoeditar.component.html',
  styleUrls: ['./catalogoeditar.component.css'],
  providers: [GeneralService]
})
export class CatalogoeditarComponent extends BaseComponent implements OnInit {

  catalogos = [];

  catalogo: Catalogos;

  editar: boolean;

  identidad = 0;

  constructor(public dialogRef: MatDialogRef < CatalogoeditarComponent >,
              private _general_services: GeneralService,
              @Inject(MAT_DIALOG_DATA) public data: CatalogosEditar,
              public _router: Router,
              public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    if (this.data.catalogo == null) {
      this.editar = false;
      this.catalogo = {
        id_catalogo: 0,
        tipo: '',
        producto: '',
        modelo: '',
        marca: '',
        caracteristica: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.catalogo = this.data.catalogo;

    }
  }
  AlertaGuardadoElemento(newForm) {
    // Preguntamos si desea Guardar el Registro
    const mensaje = confirm('¿Te gustaría Guardar el Catálogo?');
    // Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardar(newForm);
      this.openSnackBar('Catálogo Guardado', 99);
    }
  }

  guardar(newForm) {
    this.catalogo;
    this._general_services.saveCatalogo(this.catalogo, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.catalogo
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
