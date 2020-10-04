import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SeguridadService } from '../../../service/seguridad.service';
import { BaseComponent } from '../../base/base.component';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../../common/appsettings';
import { Router } from "@angular/router";
import { Usuario, ResetarClave } from '../../../interface/seguridad.interface';
@Component({
  selector: 'app-resetearclave',
  templateUrl: './resetarclave.component.html',
  styleUrls: ['./resetarclave.component.css'],
  providers: [SeguridadService]
})
export class ResetearclaveComponent extends BaseComponent {
  public titulo: String;
  public usuario: any;

  constructor(
    public dialogRef: MatDialogRef<ResetearclaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResetarClave,
    public _seguridad_service: SeguridadService,

    public snackBar: MatSnackBar, public router: Router) {
    super(snackBar, router);
    this.titulo = data.titulo;
    this.usuario = {
      username: "",
      oldpassword: "",
      password: "",
      confirmpassword: "",
      esreset:true
    };
    console.log(this.data)
    this.usuario.username = data.data.c_username;
    this.usuario.esreset=this.data.esresetpassword;
    
    console.log(this.data);

  }

  public onOkClick(usuario): void {

      this._seguridad_service.resetarclave(this.usuario, this.getToken().token).subscribe(
        result => {
          console.log(result);
              
    console.log(this.data);
          try {
            if (result.estado) {
              this.dialogRef.close();
              if (!this.data.esresetpassword) {
                this.router.navigate(['/login']);
              }
            } else {
              this.openSnackBar(result.mensaje, 999);
            }
          } catch (error) {
            this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 999);
          }
        }, error => {
          console.log(<any>error);
          try {
            this.openSnackBar(error.error.Detail, error.error.StatusCode);
          } catch (error) {
            this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 999);
          }
        });
    
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}

