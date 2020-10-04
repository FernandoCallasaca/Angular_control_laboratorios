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
} from '../../../common/appsettings';
import {
  Router
} from '@angular/router';

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
  ElementoprocedenciaeditarComponent
} from '../elementoprocedenciaeditar/elementoprocedenciaeditar.component';

@Component({
  selector: 'app-elementoprocedencia',
  templateUrl: './elementoprocedencia.component.html',
  styleUrls: ['./elementoprocedencia.component.css'],
  providers: [GeneralService]
})
export class ElementoprocedenciaComponent extends BaseComponent implements OnInit {
  tit: String = 'ELEMENTO PROCEDENCIA';

  textfilter = '';

  displayedColumns: string[] = ['editar', 'c_valor', 'eliminar'];


  public tablaElementoProcedencia: MatTableDataSource < any > ;
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
    this.gettablaElementoProcedencia();
  }

  gettablaElementoProcedencia() {
    let request = {}
    this._general_service.getElementoProcedenciaForEdit(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaElementoProcedencia = new MatTableDataSource < any > (result.data);
            this.tablaElementoProcedencia.sort = this.sort;
            this.tablaElementoProcedencia.paginator = this.paginator;
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
    this.tablaElementoProcedencia.filter = filterValue.trim().toLowerCase();
  }

  openDialog(elementoprocedencia): void {
    const dialogRef = this.dialog.open(ElementoprocedenciaeditarComponent, {
      width: '750px',
      data: {
        elementoprocedencia: elementoprocedencia
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaElementoProcedencia();

      } catch (error) {
        console.log(error);

      }
    });
  }

  eliminar(elementoprocedencia) {
    if (confirm("Are you sure to delete " + elementoprocedencia.c_valor)) {
      console.log("Implement delete functionality here");

      this._general_service.deleteElementoProcedencia(elementoprocedencia, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el registro");
              this.gettablaElementoProcedencia();
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

}
