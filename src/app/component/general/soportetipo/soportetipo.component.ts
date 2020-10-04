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
  SoportetipoeditarComponent
} from '../soportetipoeditar/soportetipoeditar.component';

@Component({
  selector: 'app-soportetipo',
  templateUrl: './soportetipo.component.html',
  styleUrls: ['./soportetipo.component.css'],
  providers: [GeneralService]
})
export class SoportetipoComponent extends BaseComponent implements OnInit {
  tit: String = "Soporte Tipo";

  textfilter = '';

  displayedColumns: string[] = ['editar', 'c_valor', 'c_descripcion', 'eliminar'];


  public tablaSoporteTipo: MatTableDataSource < any > ;
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
    this.gettablaSoporteTipo();
  }

  gettablaSoporteTipo() {
    let request = {}
    this._general_service.getSoporteTipoForEdit(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaSoporteTipo = new MatTableDataSource < any > (result.data);
            this.tablaSoporteTipo.sort = this.sort;
            this.tablaSoporteTipo.paginator = this.paginator;
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
    this.tablaSoporteTipo.filter = filterValue.trim().toLowerCase();
  }

  openDialog(soportetipo): void {
    const dialogRef = this.dialog.open(SoportetipoeditarComponent, {
      width: '750px',
      data: {
        soportetipo: soportetipo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaSoporteTipo();

      } catch (error) {
        console.log(error);

      }
    });
  }
  
  eliminar(soportetipo) {
    if (confirm("Estar Seguro de eliminar el elemento " + soportetipo.c_valor)) {
      console.log("Implement delete functionality here");

      this._general_service.deleteSoporteTipo(soportetipo, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el registro");
              this.gettablaSoporteTipo();
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
