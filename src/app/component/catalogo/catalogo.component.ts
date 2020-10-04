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
  CatalogoeditarComponent
} from './../catalogoeditar/catalogoeditar.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  providers: [GeneralService]
})
export class CatalogoComponent extends BaseComponent implements OnInit {

  tit: String = "Catálogo";

  textfilter = '';

  displayedColumns: string[] = ['editar', 'tipo', 'producto', 'modelo', 'marca', 'caracteristica', 'eliminar'];


  public tablaCatalogo: MatTableDataSource < any > ;
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
    this.gettablaCatalogo();
  }

  gettablaCatalogo() {
    let request = {
    }
    this._general_service.getCatalogo(this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaCatalogo = new MatTableDataSource < any > (result.data);
            this.tablaCatalogo.sort = this.sort;
            this.tablaCatalogo.paginator = this.paginator;
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
    this.tablaCatalogo.filter = filterValue.trim().toLowerCase();
  }

  openDialog(catalogo): void {
    const dialogRef = this.dialog.open(CatalogoeditarComponent, {
      width: '750px',
      data: {
        catalogo: catalogo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      try {
        this.gettablaCatalogo();

      } catch (error) {
        console.log(error);
      }
    });
  }

  eliminar(catalogo) {
    if (confirm("Estar Seguro de eliminar al Catálogo " + catalogo.modelo)) {
      this._general_service.deleteCatalogo(catalogo, this.getToken().token).subscribe(
        result => {
          try {
            if (result.estado) {
              console.log("Se eliminó correctamente el catálogo");
              this.gettablaCatalogo();
              this.openSnackBar("Se eliminó correctamente el catálogo", 99);
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
