import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralService } from './../../service/general.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { BaseComponent } from './../base/base.component';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/common/appsettings';
import { Catalogos } from 'src/app/interface/catalogo.interface';


@Component({
  selector: 'app-asignarcomponente',
  templateUrl: './asignarcomponente.component.html',
  styleUrls: ['./asignarcomponente.component.css'],
  providers: [ GeneralService ]
})
export class AsignarcomponenteComponent extends BaseComponent implements OnInit {

  disableSelect = new FormControl(false);

  activarBoton = true;

  idEq = -1;
  equipos = [];

  componentes = [];
  componentesSinAsignar: Catalogos[] = [];

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private generalService: GeneralService
  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.getEquipos();
    this.getComponentesSinAsignar();
  }

  displayedColumns: string[] = ['select', 'fecha', 'producto', 'modelo', 'motivo'];

  dataSource = new MatTableDataSource<Catalogos>(this.componentesSinAsignar);

  selection = new SelectionModel<Catalogos>(true, []);

  getEquipos() {
    const req1 = { };
    this.generalService.getEquipo(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.equipos = result.data;
          console.log(this.equipos);
        } else {
          this.openSnackBar(result.mensaje, 99);
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getComponentesSinAsignar() {
    const req1 = { };
    this.generalService.getCatalogo(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.componentes = result.data;
          console.log(this.componentes);
          this.dataSource.data = this.componentes.filter(componente => componente.asignado === 0);
          console.log(this.dataSource.data);
        } else {
          this.openSnackBar(result.mensaje, 99);
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Catalogos): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_catalogo + 1}`;
  }

  cambiarIdEquipo(id: number): void {
    this.activarBoton = false;
    this.idEq = id;
    this.selection.clear();
  }

  elementosSeleccionados(event: Event) {
    event.preventDefault();
    console.log('Equipos de Laboratorio');
    console.log(this.idEq);
    console.log('Estos son los elementos seleccionados');
    console.log(this.selection.selected);

    const cantidadSeleccion = this.selection.selected.length;

    for (let i = 0; i < cantidadSeleccion; i++) {
      const req = {
        id_equipo: this.idEq,
        id_catalogo: this.selection.selected[i].id_catalogo
      };
      this.saveAsignacion(req);
    }
    this.selection.clear();
    this.getComponentesSinAsignar();
    this.router.navigate(['asignarcomponentes']);
  }

  saveAsignacion( req ) {
    this.generalService.saveAsignacion(req, this.getToken().token).subscribe(
      result => {
        if (result.estado) {
        } else {
          this.openSnackBar(result.mensaje, 99);
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
