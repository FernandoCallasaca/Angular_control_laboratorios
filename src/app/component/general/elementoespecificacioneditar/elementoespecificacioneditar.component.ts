import {
  Component,
  Inject,
  OnInit,
  OnChanges,
  ViewChild
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatPaginator,
  MatTableDataSource,
  MatSort
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
  ElementoEspecificacion,
  ElementoEspecificacionEditar
} from '../../../interface/elementoespecificacion.interface';
import {
  ResultadoApi
} from '../../../interface/common.interface';

import {
  GeneralService
} from '../../../service/general.service';

interface GrupoElemento {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-elementoespecificacioneditar',
  templateUrl: './elementoespecificacioneditar.component.html',
  styleUrls: ['./elementoespecificacioneditar.component.css'],
  providers: [GeneralService]
})

export class ElementoespecificacioneditarComponent extends BaseComponent implements OnInit{

  gruposElementosGrupo: GrupoElemento[] = [];

  public tablaElementoGrupo: MatTableDataSource < any > ;
  textfilter = '';
  tablaelementosespecificacion = [];

  elementoespecificacion: ElementoEspecificacion;
  editar: boolean;
  identidad = 0;

  @ViewChild(MatPaginator, {
    static: false
  }) paginator: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sort: MatSort;

  constructor(public dialogRef: MatDialogRef < ElementoespecificacioneditarComponent > ,
    private _general_services: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: ElementoEspecificacionEditar,
    public _router: Router,
    public snackBar: MatSnackBar) {
    super(snackBar, _router);
  }

  ngOnInit() {
    this.getTablaElementoGrupo();
    //this.imprimirvalores();
    console.log('Hola Mundo');
    console.log(this.tablaElementoGrupo);
    console.log('Hola Mundo');
    console.log(this.data);
    if (this.data.elementoespecificacion == null) {
      this.editar = false;
      this.elementoespecificacion = {
        n_idins_elementoespecificacion: 0,
        n_idins_elementogrupo: 0,
        c_tipo: '',
        c_marca: '',
        c_modelo: ''
      };
      this.identidad = 0;
    } else {
      this.editar = true;
      this.elementoespecificacion = this.data.elementoespecificacion;
    }
  }

  AlertaGuardadoElemento(newForm) {
    // Traemos el número de elementos anteriores
    //this.getTablaElementoGrupo();
    var cantidad1 = this.tablaElementoGrupo.data.length;
    console.log('Cantidad 1: ' + cantidad1);
    // Preguntamos si desea Guardar el Registro
    var mensaje = confirm("¿Te gustaría Guardar el Registro?");
    //Detectamos si el usuario acepto el mensaje
    if (mensaje) {
      this.guardar(newForm);
      this.getTablaElementoGrupo();
      var cantidad2 = this.tablaelementosespecificacion.length;
      console.log('Cantidad 2: ' + cantidad2);
      if (cantidad1 == cantidad2) {
        this.openSnackBar("El elemento ya existe", 99);
      } else {
        this.openSnackBar("Elemento Guerdado", 99);
      }
    }
  }
  guardar(newForm) {
    this.elementoespecificacion;
    this._general_services.saveElementoEspecificacion(this.elementoespecificacion, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            this.dialogRef.close({
              flag: true,
              data: this.elementoespecificacion
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
    let request = {}
    this._general_services.getElementoGrupoForEdit(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            for (let index = 0; index < result.data.length; index++) {
              let ele: GrupoElemento;
              let a = result.data[index].n_idins_elementogrupo;
              let b = result.data[index].c_valor;
              ele = {
                value: a,
                viewValue: b
              }
              this.gruposElementosGrupo.push(ele);
            }
            this.tablaElementoGrupo = new MatTableDataSource < any > (result.data);
            this.tablaElementoGrupo.sort = this.sort;
            this.tablaElementoGrupo.paginator = this.paginator;
          } else {
            this.openSnackBar(result.mensaje, 99);
          }
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        } finally {
          this.applyFilter(this.textfilter);
        }
      }, error => {
        this.openSnackBar(error.error, 99);
      });
  }
  applyFilter(filterValue: String) {
    this.tablaElementoGrupo.filter = filterValue.trim().toLowerCase();
  }

}
