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
  ElementoGrupo,
  ElementoGrupoEditar
} from '../../../interface/elementogrupo.interface';
import {
  ResultadoApi
} from '../../../interface/common.interface';

import {
  GeneralService
} from '../../../service/general.service';

export interface SubGrupo {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-elementogrupoeditar',
  templateUrl: './elementogrupoeditar.component.html',
  styleUrls: ['./elementogrupoeditar.component.css'],
  providers: [GeneralService]
})
export class ElementogrupoeditarComponent extends BaseComponent implements OnInit {
  elementogrupos = [];

    subGrupos: SubGrupo[] = [{
      value: 'Equipo',
      viewValue: 'Equipo'
    },
    {
      value: 'Componente',
      viewValue: 'Componente'
    }
  ];

  elementogrupo: ElementoGrupo;
  editar: boolean;
  identidad = 0;

  constructor(public dialogRef: MatDialogRef < ElementogrupoeditarComponent > ,
    private _general_services: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: ElementoGrupoEditar,
    public _router: Router,
    public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    this.getTablaElementoGrupo();
    var cantidad1 = this.elementogrupos.length;
    console.log('Cantidad 1: ' + cantidad1);
    console.log(this.data);
    if (this.data.elementogrupo == null) {
      this.editar = false;
      this.elementogrupo = {
        n_idins_elementogrupo: 0,
        c_subgrupo: '',
        c_valor: '',
        c_descripcion: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.elementogrupo = this.data.elementogrupo;

    }
    console.log('Contenido de elemento grupo');
    console.log(this.elementogrupo.c_subgrupo);
  }
  AlertaGuardadoElemento(newForm) {
    // Traemos el número de elementos anteriores
    //this.getTablaElementoGrupo();
    var cantidad1 = this.elementogrupos.length;
    console.log('Cantidad 1: ' + cantidad1);
    // Preguntamos si desea Guardar el Registro
    var mensaje = confirm("¿Te gustaría Guardar el Registro?");
    // Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardar(newForm);
      this.getTablaElementoGrupo();
      var cantidad2 = this.elementogrupos.length;
      console.log('Cantidad 2: ' + cantidad2);
      if(cantidad1==cantidad2){
        this.openSnackBar("El elemento ya existe", 99);
      }
      else{
        this.openSnackBar("Elemento Guerdado", 99);
      }
    }
  }
  guardar(newForm) {
    this.elementogrupo;
    this._general_services.saveElementoGrupo(this.elementogrupo, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.elementogrupo
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

  getTablaElementoGrupo() {
    let request = {

    };
    this._general_services.getElementoGrupoForEdit(this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.elementogrupos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });

  }

}
