import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatPaginator,
  MatTableDataSource,
  MatSort
} from '@angular/material';
import {
  MatDialog
} from '@angular/material';
import {
  MatSnackBar
} from '@angular/material';
import {
  AppSettings
} from '../../../common/appsettings'
import {
  Router
} from "@angular/router";

import {
  BaseComponent
} from '../../base/base.component';

import {
  ResultadoApi
} from '../../../interface/common.interface';
import {
  Confirmar
} from '../../../interface/confirmar.interface';

import {
  GeneralService
} from '../../../service/general.service';

import {
  ResetearclaveComponent
} from '../../generico/resetarclave/resetarclave.component';
import {
  ConfirmarComponent
} from '../../generico/confirmar/confirmar.component';
import {
  ElementoespecificacioneditarComponent
} from '../elementoespecificacioneditar/elementoespecificacioneditar.component';
interface GrupoElemento {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-elementoespecificacion',
  templateUrl: './elementoespecificacion.component.html',
  styleUrls: ['./elementoespecificacion.component.css'],
  providers: [GeneralService]
})
export class ElementoespecificacionComponent extends BaseComponent implements OnInit {
  tipos = [];
  marcas = [];
  modelos = [];
  
  idgrupo = 0;
  c_tipo = '';
  c_marca = '';
  c_modelo = '';

  gruposElementosGrupo: GrupoElemento[] = [];

  tit: String = "ELEMENTOS ESPECIFICACIÓN";

  textfilter = '';

  displayedColumns: string[] = ['editar', 'c_valor', 'c_tipo', 'c_marca', 'c_modelo', 'eliminar'];

  public tablaElementoGrupo: MatTableDataSource < any > ;
  public tablaElementoEspecificacion: MatTableDataSource < any > ;
  public confirmar: Confirmar;

  @ViewChild(MatPaginator, {
    static: false
  }) paginator: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sort: MatSort;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public _general_service: GeneralService,
    public dialog: MatDialog
  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.getTablaElementoGrupo();
    this.gettablaElementoEspecificacion();
  }

  gettablaElementoEspecificacion() {
    let request = {}
    this._general_service.getElementoEspecificacionForEdit(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaElementoEspecificacion = new MatTableDataSource < any > (result.data);
            this.tablaElementoEspecificacion.sort = this.sort;
            this.tablaElementoEspecificacion.paginator = this.paginator;
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
    this.tablaElementoEspecificacion.filter = filterValue.trim().toLowerCase();
  }

  openDialog(elementoespecificacion): void {
    const dialogRef = this.dialog.open(ElementoespecificacioneditarComponent, {
      width: '750px',
      data: {
        elementoespecificacion: elementoespecificacion
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaElementoEspecificacion();

      } catch (error) {
        console.log(error);

      }
    });
  }
  
  eliminar(elementoespecificacion) {
    if (confirm("Estar Seguro de eliminar el elemento " + elementoespecificacion.c_valor)) {
      console.log("Implement delete functionality here");

      this._general_service.deleteElementoEspecificacion(elementoespecificacion, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el registro");
              this.gettablaElementoEspecificacion();
              this.openSnackBar("Se eliminó correctamente el registro", 99);
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
  selectgrupo(n_idins_elementogrupo){
    this.idgrupo = n_idins_elementogrupo;
    this.getTipoForEspecificacion(n_idins_elementogrupo);
  }
  selecttipo(c_tipo) {
    this.c_tipo = c_tipo;
    this.getMarcaForEspecificacion(c_tipo);
  }
  selectmarca(c_marca) {
    this.c_marca = c_marca;
    this.getModeloForEspecificacion(c_marca);
  }
  selectmodelo(c_modelo) {
    this.c_modelo = c_modelo;
  }
  getTablaElementoGrupo() {
    let request = {}
    this._general_service.getElementoGrupoForEdit(this.getToken().token).subscribe(
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

  getTipoForEspecificacion(n_idins_elementogrupo) {
    let req = {
      n_idins_elementogrupo: n_idins_elementogrupo
    };
    this._general_service.getTipoForEspecificacion(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.tipos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }
  getMarcaForEspecificacion(c_tipo) {
    let req = {
      c_tipo: c_tipo
    };
    this._general_service.getMarcaForEspecificacion(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.marcas = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }
  getModeloForEspecificacion(c_marca) {
    let req = {
      c_marca: c_marca
    };
    this._general_service.getModeloForEspecificacion(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.modelos = resultado.data;
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
