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
  SoportetecnicoeditarComponent
} from './../soportetecnicoeditar/soportetecnicoeditar.component';

@Component({
  selector: 'app-soportetecnico',
  templateUrl: './soportetecnico.component.html',
  styleUrls: ['./soportetecnico.component.css'],
  providers: [GeneralService]
})
export class SoportetecnicoComponent extends BaseComponent implements OnInit {

  tit: String = 'Soporte Técnico';

  textfilter = '';

  displayedColumns: string[] = ['editar', 'nombres', 'apellidos', 'dni', 'telefono', 'username', 'eliminar'];


  public tablaSoporteTecnico: MatTableDataSource < any > ;
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
    this.gettablaSoporteTecnico();
  }

  gettablaSoporteTecnico() {
    let request = {
    }
    this._general_service.getSoporteTecnico(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaSoporteTecnico = new MatTableDataSource < any > (result.data);
            this.tablaSoporteTecnico.sort = this.sort;
            this.tablaSoporteTecnico.paginator = this.paginator;
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
    this.tablaSoporteTecnico.filter = filterValue.trim().toLowerCase();
  }

  openDialog(soportetecnico): void {
    const dialogRef = this.dialog.open(SoportetecnicoeditarComponent, {
      width: '750px',
      data: {
        soportetecnico: soportetecnico
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaSoporteTecnico();

      } catch (error) {
        console.log(error);
      }
    });
  }

  eliminar(soportetecnico) {
    if (confirm("Estar Seguro de eliminar al soporte técnico " + soportetecnico.nombres)) {
      console.log("Implement delete functionality here");

      this._general_service.deleteDocente(soportetecnico, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el Soporte Técnico");
              this.gettablaSoporteTecnico();
              this.openSnackBar("Se eliminó correctamente el Soporte Técnico", 99);
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
