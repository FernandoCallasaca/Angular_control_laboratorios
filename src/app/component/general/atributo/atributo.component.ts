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
  AtributoeditarComponent
} from '../atributoeditar/atributoeditar.component';

@Component({
  selector: 'app-atributo',
  templateUrl: './atributo.component.html',
  styleUrls: ['./atributo.component.css'],
  providers: [GeneralService]
})
export class AtributoComponent extends BaseComponent implements OnInit {
  tit: String = "Atributo";

  textfilter = '';

  displayedColumns: string[] = ['editar', 'nombres', 'apellidos', 'condicion', 'regimen', 'categoria', 'eliminar'];


  public tablaAtributo: MatTableDataSource < any > ;
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
    this.gettablaAtributo();
  }

  gettablaAtributo() {
    let request = {

    }
    this._general_service.getDocente(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaAtributo = new MatTableDataSource < any > (result.data);
            this.tablaAtributo.sort = this.sort;
            this.tablaAtributo.paginator = this.paginator;
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
    this.tablaAtributo.filter = filterValue.trim().toLowerCase();
  }

  openDialog(atributo): void {
    const dialogRef = this.dialog.open(AtributoeditarComponent, {
      width: '750px',
      data: {
        atributo: atributo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaAtributo();

      } catch (error) {
        console.log(error);

      }
    });
  }
  
  eliminar(atributo) {
    if (confirm("Estar Seguro de eliminar el elemento " + atributo.c_valor)) {
      console.log("Implement delete functionality here");

      this._general_service.deleteAtributo(atributo, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el registro");
              this.gettablaAtributo();
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
