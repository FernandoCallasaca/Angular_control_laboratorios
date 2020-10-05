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
  EquipoeditarComponent
} from './../equipoeditar/equipoeditar.component';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css'],
  providers: [GeneralService]
})
export class EquipoComponent implements OnInit {
  
  tit: String = "Equipo";

  textfilter = '';

  displayedColumns: string[] = ['editar', 'catalogo', 'estado', 'ubicacion', 'eliminar'];


  public tablaEquipo: MatTableDataSource < any > ;
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
    this.gettablaEquipo();
  }

  gettablaEquipo() {
    let request = {
    }
    this._general_service.getEquipo(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaEquipo = new MatTableDataSource < any > (result.data);
            this.tablaEquipo.sort = this.sort;
            this.tablaEquipo.paginator = this.paginator;
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
    this.tablaEquipo.filter = filterValue.trim().toLowerCase();
  }

  openDialog(equipo): void {
    const dialogRef = this.dialog.open(DocenteeditarComponent, {
      width: '750px',
      data: {
        equipo: equipo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaEquipo();

      } catch (error) {
        console.log(error);
      }
    });
  }

  eliminar(equipo) {
    if (confirm("Esta Seguro de eliminar el Equipo " + equipo.nombres)) {
      console.log("Implement delete functionality here");

      this._general_service.deleteEquipo(equipo, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el equipo");
              this.gettablaEquipo();
              this.openSnackBar("Se eliminó correctamente el equipo", 99);
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
