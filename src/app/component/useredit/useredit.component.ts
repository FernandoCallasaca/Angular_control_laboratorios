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
  Usuarios,
  UsuariosEditar
} from '../../interface/user.interface';
import {
  ResultadoApi
} from '../../interface/common.interface';

import {
  GeneralService
} from '../../service/general.service';

@Component({
  selector: 'app-useredit',
  templateUrl: './useredit.component.html',
  styleUrls: ['./useredit.component.css'],
  providers: [GeneralService]
})
export class UsereditComponent extends BaseComponent implements OnInit {

  hide = true;
  
  usuarios = [];

  usuario: Usuarios;

  editar: boolean;

  identidad = 0;

  constructor(public dialogRef: MatDialogRef < UsereditComponent >,
              private _general_services: GeneralService,
              @Inject(MAT_DIALOG_DATA) public data: UsuariosEditar,
              public _router: Router,
              public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    if (this.data.usuario == null) {
      this.editar = false;
      this.usuario = {
        id_usuario: 0,
        username: '',
        password: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.usuario = this.data.usuario;

    }
  }

  AlertaGuardadoElemento(newForm) {
    const mensaje = confirm('¿Te gustaría Guardar el Registro?');
    if (mensaje) {
      this.guardar(newForm);
      this.openSnackBar('Elemento Guardado', 99);
    }
  }

  guardar(newForm) {
    this._general_services.saveUsuario(this.usuario, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.usuario
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
