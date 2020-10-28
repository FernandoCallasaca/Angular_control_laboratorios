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
import { VwIncidencia } from './../../interface/vwincidencia.interface';



@Component({
  selector: 'app-asignar-incidencias',
  templateUrl: './asignar-incidencias.component.html',
  styleUrls: ['./asignar-incidencias.component.css'],
  providers: [ GeneralService ]
})
export class AsignarIncidenciasComponent extends BaseComponent implements OnInit {

  disableSelect = new FormControl(false);

  activarBoton = true;

  idSP = -1;
  soportesTecnicos = [];

  incidencias = [];
  incidendiasSinAsignar: VwIncidencia[] = [];

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private generalService: GeneralService
  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.getSoporteTecnicos();
    this.getIncidenciasSinAsignar();
  }

  displayedColumns: string[] = ['select', 'fecha', 'laboratorio', 'equipo', 'motivo'];

  dataSource = new MatTableDataSource<VwIncidencia>(this.incidendiasSinAsignar);

  selection = new SelectionModel<VwIncidencia>(true, []);

  getSoporteTecnicos() {
    const req1 = { };
    this.generalService.getSoporteTecnico(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.soportesTecnicos = result.data;
          console.log(this.soportesTecnicos);
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

  getIncidenciasSinAsignar() {
    const req1 = { };
    this.generalService.getIncidencias(this.getToken().token).subscribe(
      result => {
        if (result.estado) {
          this.incidencias = result.data;
          console.log(this.incidencias);
          this.dataSource.data = this.incidencias.filter(incidencia => incidencia.asignado === 0);
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
  checkboxLabel(row?: VwIncidencia): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_incidencia + 1}`;
  }

  cambiarIdSoporteTecnico(id: number): void {
    this.activarBoton = false;
    this.idSP = id;
    this.selection.clear();
  }

  elementosSeleccionados(event: Event) {
    event.preventDefault();
    console.log('Personal de Soporte Técnico');
    console.log(this.idSP);
    console.log('Estos son los elementos seleccionados');
    console.log(this.selection.selected);

    const cantidadSeleccion = this.selection.selected.length;

    for (let i = 0; i < cantidadSeleccion; i++) {
      const req = {
        id_soportetecnico: this.idSP,
        id_incidencia: this.selection.selected[i].id_incidencia
      };
      this.saveAsignacion(req);
    }
    this.selection.clear();
    this.getIncidenciasSinAsignar();
    this.router.navigate(['controlincidencias']);
  }

  saveAsignacion( req ) {
    // const req = {
    //   id_soportetecnico: this.idMotivo,
    //   id_incidencia: this.id_incidencia
    // };
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
