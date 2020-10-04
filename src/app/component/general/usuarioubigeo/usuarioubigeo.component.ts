import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { AppSettings } from '../../../common/appsettings';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { MapaService } from '../../../service/mapa.services';
import { BaseComponent } from '../../base/base.component';
import { SeguridadService } from '../../../service/seguridad.service';
import { ResultadoApi } from '../../../interface/common.interface';
import { GeneralService } from '../../../service/general.service';

import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-usuarioubigeo',
  templateUrl: './usuarioubigeo.component.html',
  styleUrls: ['./usuarioubigeo.component.css'],
  providers: [SeguridadService, GeneralService, MapaService, NgbModule]
})
export class UsuarioubigeoComponent extends BaseComponent implements OnInit {

  departamentos = [];
  provincias = [];
  distritos = [];
  centropoblados = [];
  entidades = [];
  usuarios = [];
  periodos = [];
  mantenimientos = []
  textfilter = '';

  iddepartamento = -100;
  idprovincia = -100;
  iddistrito: number = -100;
  idcentropoblado: number = -100;
  idusuario = 100;
  idperiodo = 100;
  identidad: number = 100;
  idmantenimiento: number = 100;
  idestado: number = 100;

  displayedColumns: string[] = ['suministro', 'departamento', 'provincia', 'distrito', 'centropoblado', 'estado', 'asignado'];

  public tablaUsuarioubigeo: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public _mapa_service: MapaService,
    public dialog: MatDialog,
    public _seguridad_service: SeguridadService,
    public _general_service: GeneralService
  ) { 
    super(snackBar, router);
  }

  ngOnInit() {
    this.getPeriodo();
    this.getDepartamento();
    this.getEntidad();
    this.getMantenimiento();
    //this.getTablaUsuarioubigeo();
  }

  selectdepartamento() {
    this.iddepartamento = this.iddepartamento;
    this.getProvincia();
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();

    this.idprovincia = -100;
    this.iddistrito = -100;
    this.idcentropoblado = -100;
  }

  selectprovincia() {
    this.idprovincia = this.idprovincia;
    console.log(this.idprovincia)

    this.getDistrito();
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();

    this.iddistrito = -100;
    this.idcentropoblado = -100;
  }

  selectdistrito() {
    this.iddistrito = this.iddistrito;
    this.getCentroPoblado();
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();

    this.idcentropoblado = -100;
  }

  selectcentropoblado() {
    this.idcentropoblado = this.idcentropoblado;
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();
  }

  selectperiodo(n_idgen_periodo) {
    this.idperiodo = n_idgen_periodo;
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();
  }

  selectentidad() {
    this.identidad = this.identidad;
    
    this.getUsuario();
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();

    this.idusuario = 100;
  }

  selectusuario() {
    this.limpiarTabla();
  }

  selectmantenimiento(n_idgen_mantenimiento){
    this.idmantenimiento = n_idgen_mantenimiento;
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();
  }

  selectestado(){
    this.idestado = this.idestado;
    //this.getTablaUsuarioubigeo();
    this.limpiarTabla();
  }

  limpiarTabla(){
    this.tablaUsuarioubigeo = new MatTableDataSource<any>(null);
    this.tablaUsuarioubigeo.sort = this.sort;
    this.tablaUsuarioubigeo.paginator = this.paginator;
  }

  getTablaUsuarioubigeo() {
    //console.log(this.idusuario)
    let mensajeconfirm = '';
    let validarequerido = 0;
    
    if (this.iddepartamento == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idprovincia == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.iddistrito == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idcentropoblado == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idperiodo == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idusuario == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idmantenimiento == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idestado == 100) {
      validarequerido = validarequerido + 1;
    }

    if (validarequerido == 0) {
      let request = {
        n_idgen_departamento : this.iddepartamento,
        n_idgen_provincia : this.idprovincia,
        n_idgen_distrito : this.iddistrito,
        n_idgen_centropoblado : this.idcentropoblado,
        n_idseg_user : this.idusuario,
        n_idgen_periodo : this.idperiodo,
        n_idgen_tipoprograma : this.idmantenimiento,
        n_id_estado : this.idestado
      }
      this._general_service.getUsuarioubigeo(request, this.getToken().token).subscribe(
        result => {
  
          try {
            if (result.estado) {
              console.log(result);
              this.tablaUsuarioubigeo = new MatTableDataSource<any>(result.data);
              this.tablaUsuarioubigeo.sort = this.sort;
              this.tablaUsuarioubigeo.paginator = this.paginator;

              this.applyFilter(this.textfilter);
            } else {
              this.openSnackBar(result.mensaje, 99);
            }
          } catch (error) {
            this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
          } finally {
         
          }
        }, error => {
          this.openSnackBar(error.error, 99);
        });

    } else {
      this.openSnackBar("ALERTA: Seleccionar los campos obligatorios (*)", 99);
    }
  }

  applyFilter(filterValue: String) {
    this.tablaUsuarioubigeo.filter = filterValue.trim().toLowerCase();
  }

  getDepartamento() {
    this._mapa_service.getDepartamento(this.getToken().token).subscribe(
      result => {

        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          this.departamentos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getProvincia() {
    let req = { n_idgen_departamento: this.iddepartamento };
    this._mapa_service.getProvincia(req, this.getToken().token).subscribe(
      result => {

        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          this.provincias = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getDistrito() {
    let req = { n_idgen_provincia: this.idprovincia };
    this._mapa_service.getDistrito(req, this.getToken().token).subscribe(
      result => {

        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          this.distritos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getCentroPoblado() {
    let req = { n_idgen_distrito: this.iddistrito };
    this._mapa_service.getCentroPoblado(req, this.getToken().token).subscribe(
      result => {

        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          this.centropoblados = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getEntidad() {
    this._mapa_service.getEntidad(this.getToken().token).subscribe(
      result => {
        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          this.entidades = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getMantenimiento(){
    let request = {

    };
    this._general_service.getMantenimiento(this.getToken().token).subscribe(
      result => {

        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          this.mantenimientos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });

  }

  getUsuario() {
    let request = {
      n_idseg_role: 0,
      n_idgen_entidad: this.identidad
    }
    this._seguridad_service.get(request, this.getToken().token).subscribe(
      result => {

        let resultado = <ResultadoApi>result;

        if (resultado.estado) {
          this.usuarios = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getPeriodo() {
    let request = {

    };
    this._general_service.getPeriodo(this.getToken().token).subscribe(
      result => {

        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          this.periodos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  asignartodo(){
    
    let mensajeconfirm = '';
    let validarequerido = 0;
    
    if (this.iddepartamento == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idprovincia == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.iddistrito == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idcentropoblado == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idperiodo == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idusuario == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idmantenimiento == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idestado == 100) {
      validarequerido = validarequerido + 1;
    }

    if (validarequerido == 0) {

        mensajeconfirm = '¿Está seguro que desea asignar todo el filtro seleccionado? ';
        if(confirm(mensajeconfirm)) {
          console.log("Implement insert functionality here");
        
          let request = {
            n_idgen_departamento : this.iddepartamento,
            n_idgen_provincia : this.idprovincia,
            n_idgen_distrito : this.iddistrito,
            n_idgen_centropoblado : this.idcentropoblado,
            n_idseg_user : this.idusuario,
            n_idgen_periodo : this.idperiodo,
            n_idgen_tipoprograma : this.idmantenimiento,
            n_id_estado : this.idestado
          }
              
          this._general_service.asignartodo(request, this.getToken().token).subscribe(
            result => {
              try {
                if (result.estado) {
                  this.getTablaUsuarioubigeo();
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
      } else {
        this.openSnackBar("ALERTA: Seleccionar los campos obligatorios (*)", 99);
      }
  }


  asignar(entidad, flag){

    let mensajeconfirm = '';
    let validarequerido = 0;
    
    if (this.iddepartamento == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idprovincia == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.iddistrito == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idcentropoblado == -100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idperiodo == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idusuario == 100) {
      validarequerido = validarequerido + 1;
    }

    if (this.idmantenimiento == 100) {
      validarequerido = validarequerido + 1;
    }

    if (validarequerido == 0) {
      if (flag) {
        /*mensajeconfirm = '¿Está seguro que desea asignar el distrito [' + entidad.distrito +']? ';
        if(confirm(mensajeconfirm)) {*/
          console.log("Implement insert functionality here");
        
          let request = {
            n_idgen_sistemafotovoltaico : entidad.n_idgen_sistemafotovoltaico,
            n_idseg_user : this.idusuario,
            n_idgen_periodo : this.idperiodo,
            n_idgen_tipoprograma : this.idmantenimiento
          }
              
          this._general_service.saveUsuarioUbigeo(request, this.getToken().token).subscribe(
            result => {
              try {
                if (result.estado) {
                  this.getTablaUsuarioubigeo();
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
          /*}*/

      } else {
        /*mensajeconfirm = '¿Está seguro que desea desasignar el distrito [' + entidad.distrito + ']? ';
        if(confirm(mensajeconfirm)) {*/
          console.log("Implement insert functionality here");
        
          let request = {
            n_idgen_sistemafotovoltaico : entidad.n_idgen_sistemafotovoltaico,
            n_idseg_user : this.idusuario,
            n_idgen_periodo : this.idperiodo,
            n_idgen_tipoprograma : this.idmantenimiento
          }
              
          this._general_service.deleteUsuarioUbigeo(request, this.getToken().token).subscribe(
            result => {
              try {
                if (result.estado) {
                  this.getTablaUsuarioubigeo();
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
        /*}*/
      } else {
        this.openSnackBar("ALERTA: Seleccionar los campos obligatorios (*)", 99);
      }
    } 
}