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
  Equipos,
  EquiposEditar,
} from '../../interface/equipo.interface';
import {
  ResultadoApi
} from '../../interface/common.interface';

import {
  GeneralService
} from '../../service/general.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-equipoeditar',
  templateUrl: './equipoeditar.component.html',
  styleUrls: ['./equipoeditar.component.css'],
  providers: [GeneralService]
})

export class EquipoeditarComponent extends BaseComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  equipos = [];
  idLab = -1;
  laboratorios = [];

  idProd = -1;
  productos = [];
  disableSelect = new FormControl(false);

  equipo: Equipos;
  editar: boolean;
  identidad = 0;

  estados =  [{
    value: 'activo',
    viewValue: 'Activo'
  }, {
    value: 'mantenimiento',
    viewValue: 'Mantenimiento'
  }];

  constructor(public dialogRef: MatDialogRef < EquipoeditarComponent >,
    private generalService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: EquiposEditar,
    public _router: Router,
    public snackBar: MatSnackBar) {
      super(snackBar, _router);
  } 

  ngOnInit() {
    this.getLaboratorios();
    this.getProductos();
    if (this.data.equipo == null) {
      this.editar = false;
      this.equipo = {
        id_equipo: 0,
        producto:'',
        modelo:'',
        marca:'',
        estado: '',
        ubicacion: 0
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.equipo = this.data.equipo;
    }
  }

  getProductos() {
    const req1 = { };
    this.generalService.getCatalogo (this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.productos = result.data;
          console.log(this.productos);
        } else {
          this.openSnackBar(result.mensaje, 99);
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getLaboratorios() {
    const req1 = { };
    this.generalService.getEquipo(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.equipos = result.data;
          const distinto = (valor, indice, self) => {
            return self.indexOf(valor) === indice;
          };
          this.laboratorios = this.equipos.map(equipo => equipo.ubicacion).filter(distinto).sort();
        } else {
          this.openSnackBar(result.mensaje, 99);
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }
  AlertaGuardadoElemento( ) {
    // Preguntamos si desea Guardar el Registro
    const mensaje = confirm('¿Te gustaría Guardar el Equipo?');
    // Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardar();
      this.openSnackBar('Equipo Guardado', 99);
    }
  }
  guardar() {
    const req = {
      id_catalogo: this.idProd,
      estado: this.estados,
      ubicacion: this.idLab
    };
    this.generalService.saveEquipo(this.equipo, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.equipo
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
