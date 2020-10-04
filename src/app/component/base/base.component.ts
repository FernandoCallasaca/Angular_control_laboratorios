import { Component, OnInit } from '@angular/core';
import { SnackComponent } from '../generico/snack/snack.component';
import { SnackInterface } from '../../interface/snack.interface';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../common/appsettings'
import { Router } from "@angular/router";
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  bLogin:boolean=true;
  
  objsnack: SnackInterface = {
    mensaje: "",
    tipo: 0
  };

  pagin: string[] =['10','20','50','100'];

  constructor(
    public snackBar: MatSnackBar, public router: Router
  ) {
    this.isLogin();
    console.log('getToken() - Constructor');
    console.log(this.getToken());
  }

  ngOnInit() {
    console.log('getToken() - ngonInit');
    console.log(this.getToken());
  }


  public isLogin() {
    if (this.getToken() == null) {
      this.router.navigate(['/login']);
      this.bLogin=false;
    } else{
      this.bLogin=true;
    }
    console.log('blogin');
    console.log(this.bLogin);
  }

  public getToken(): any {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
  }
  public getTokenString(): String {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.tocken;
  }
  
  public getUsuarioLogin(): String {
    var currentUser = JSON.parse(localStorage.getItem('user'));
    return currentUser.token;
  }
  public setToken(obj) {
    localStorage.setItem('currentUser', JSON.stringify(obj));
  }

  public openSnackBar(mensaje: String, tipo: number) {
    this.objsnack.mensaje = mensaje;
    this.objsnack.tipo = tipo;
    this.snackBar.openFromComponent(SnackComponent, {
      duration: 2500,
      data: this.objsnack
    });
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
