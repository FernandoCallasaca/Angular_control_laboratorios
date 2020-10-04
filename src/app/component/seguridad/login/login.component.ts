import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from "@angular/router";
import { BaseComponent } from '../../base/base.component';
import { SeguridadService } from '../../../service/seguridad.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[SeguridadService]
})
export class LoginComponent extends BaseComponent implements OnInit {
  public typepassword:String="password";
  public iconpassword:String ="visibility_off";
  ruta_img_login: String;
  flag=false;
  dataLogin = {
    c_username: "",
    c_password: ""
  };
  resultado = {
    expiration: "",
    token: "",
    cMensaje: "",
    flag:false
  };
  isActive:boolean= true;

  constructor(public _login_service: SeguridadService, public router: Router, public snackBar: MatSnackBar) { 
    super(snackBar,router);
    this.ruta_img_login = "assets/images/fondologin1.png";
  }

  ngOnInit() {
  }

  login(form) {
    console.log(this.dataLogin);
    this._login_service.login(this.dataLogin).subscribe(
      result => {
        console.log('resultado');
        console.log(result);
        if (result.estado) {
          this.setToken(result);
          this.router.navigate(['/docente']);
          this.isLogin();
        } else {
          this.openSnackBar(result.mensaje, 99);
          this.isLogin();
        }
        form.reset();

      }, error => {
        console.log(error);
        this.openSnackBar(error.error.Detail, error.error.StatusCode);
        form.reset();
        this.isLogin();
      });
  }
  changetipepassword(){
    if(this.typepassword=="password"){
      this.typepassword="text";
      this.iconpassword="visibility";
    }else{
      this.typepassword="password";
      this.iconpassword="visibility_off";
    }
  }
}
