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
} from '../../common/appsettings'
import {
  Router
} from "@angular/router";
import {
  BaseComponent
} from '../base/base.component';
import {
  ResultadoApi
} from '../../interface/common.interface';
import {
  Confirmar
} from '../../interface/confirmar.interface';
import {
  GeneralService
} from '../../service/general.service';
import {
  ResetearclaveComponent
} from '../generico/resetarclave/resetarclave.component';
import {
  ConfirmarComponent
} from '../generico/confirmar/confirmar.component';
import {
  DocenteeditarComponent
} from './../docenteeditar/docenteeditar.component';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css'],
  providers: [GeneralService]
})
export class DocenteComponent extends BaseComponent implements OnInit {

  tit: String = "Docente";

  textfilter = '';

  displayedColumns: string[] = ['editar', 'nombres', 'apellidos', 'condicion', 'categoria', 'regimen', 'eliminar'];


  public tablaDocente: MatTableDataSource < any > ;
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
    this.gettablaDocente();
  }

  gettablaDocente() {
    let request = {
    }
    this._general_service.getDocente(this.getToken().token).subscribe(
      result => {
        try { 
          if (result.estado) {
            console.log(result);
            this.tablaDocente = new MatTableDataSource < any > (result.data);
            this.tablaDocente.sort = this.sort;
            this.tablaDocente.paginator = this.paginator;
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
    this.tablaDocente.filter = filterValue.trim().toLowerCase();
  }

  openDialog(docente): void {
    const dialogRef = this.dialog.open(DocenteeditarComponent, {
      width: '750px',
      data: {
        docente: docente
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaDocente();

      } catch (error) {
        console.log(error);
      }
    });
  }

  eliminar(docente) {
    if (confirm("Estar Seguro de eliminar al docente " + docente.nombres)) {
      console.log("Implement delete functionality here");

      this._general_service.deleteDocente(docente, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el docente");
              this.gettablaDocente();
              this.openSnackBar("Se eliminó correctamente el docente", 99);
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
