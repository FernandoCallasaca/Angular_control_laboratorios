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
  UsereditComponent
} from './../useredit/useredit.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [GeneralService]
})
export class UserComponent extends BaseComponent implements OnInit {

  tit: String = "Usuario";

  textfilter = '';

  displayedColumns: string[] = ['editar', 'username', 'password', 'eliminar'];


  public tablaUsuario: MatTableDataSource < any > ;
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
    this.gettablaUsuario();
  }

  gettablaUsuario() {
    const request = {
    };
    this._general_service.getUsuario(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaUsuario = new MatTableDataSource < any > (result.data);
            this.tablaUsuario.sort = this.sort;
            this.tablaUsuario.paginator = this.paginator;
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
    this.tablaUsuario.filter = filterValue.trim().toLowerCase();
  }

  openDialog(usuario): void {
    const dialogRef = this.dialog.open(UsereditComponent, {
      width: '750px',
      data: {
        usuario: usuario
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaUsuario();

      } catch (error) {
        console.log(error);
      }
    });
  }

  eliminar(usuario) {
    if (confirm('Estar Seguro de eliminar al Usuario ' + usuario.username)) {
      console.log('Implement delete functionality here');

      this._general_service.deleteUsuario(usuario, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log('Se eliminó correctamente el Usuario');
              this.gettablaUsuario();
              this.openSnackBar('Se eliminó correctamente el usuario', 99);
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
