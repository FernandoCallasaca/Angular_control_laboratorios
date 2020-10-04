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
import { MapaService } from '../../../service/mapa.services';
import {
  ResetearclaveComponent
} from '../../generico/resetarclave/resetarclave.component';
import {
  ConfirmarComponent
} from '../../generico/confirmar/confirmar.component';
import { SeguridadService } from '../../../service/seguridad.service';
import * as JsPDF from 'jspdf';

@Component({
  selector: 'app-reparto',
  templateUrl: './reparto.component.html',
  styleUrls: ['./reparto.component.css'],
  providers: [GeneralService, MapaService, SeguridadService]
})
export class RepartoComponent extends BaseComponent implements OnInit {

  tit: String = 'Reparto';

  textfilter = '';

  displayedColumns: string[] = ['c_departamento', 'c_codigo', 'c_centropoblado',
    'c_nombresapellidospe', 'c_fecha', 'c_dni', 'descargar'
  ];
  departamentos = [];
  provincias = [];
  distritos = [];
  centropoblados = [];
  entidades = [];
  periodos = [];
  usuarios = []
  detalles = [];

  iddepartamento: number = 0;
  idprovincia: number = 0;
  iddistrito: number = 0;
  idcentropoblado: number = 0;
  identidad: number = 0;
  idperiodo: number = 0;
  idusuario: number = 0;

  public tablaReparto: MatTableDataSource < any > ;
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
    public _mapa_service: MapaService,
    public _seguridad_service: SeguridadService,
    public dialog: MatDialog
  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.gettablaReparto();
    this.getPeriodo();
    this.getDepartamento();
    this.getEntidad();
  }

  gettablaReparto() {
    let request = {
      n_idgen_departamento: this.iddepartamento,
      n_idgen_provincia: this.idprovincia,
      n_idgen_distrito: this.iddistrito,
      n_idgen_centropoblado: this.idcentropoblado,
      n_idgen_entidad: this.identidad,
      n_idgen_periodo: this.idperiodo,
      n_idseg_user: this.idusuario
    }
    this._general_service.getReparto(request, this.getToken().token).subscribe(
      result => {
        try {
          if (result.estado) {
            console.log(result);
            this.tablaReparto = new MatTableDataSource < any > (result.data);
            this.tablaReparto.sort = this.sort;
            this.tablaReparto.paginator = this.paginator;
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
  getDepartamento() {
    this._mapa_service.getDepartamento(this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.departamentos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getProvincia(n_idgen_departamento) {
    let req = {
      n_idgen_departamento: n_idgen_departamento
    };
    this._mapa_service.getProvincia(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.provincias = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getDistrito(n_idgen_provincia) {
    let req = {
      n_idgen_provincia: n_idgen_provincia
    };
    this._mapa_service.getDistrito(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.distritos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getCentroPoblado(n_idgen_distrito) {
    let req = {
      n_idgen_distrito: n_idgen_distrito
    };
    this._mapa_service.getCentroPoblado(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.centropoblados = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getEntidad() {
    this._mapa_service.getEntidad(this.getToken().token).subscribe(
      result => {
        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.entidades = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getPeriodo() {
    let request = {

    };
    this._general_service.getPeriodo(this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.periodos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  getUsuario(n_idgen_entidad) {
    let request = {
      n_idseg_role: 0,
      n_idgen_entidad: n_idgen_entidad
    }
    this._seguridad_service.get(request, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.usuarios = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }

  
  applyFilter(filterValue: String) {
    this.tablaReparto.filter = filterValue.trim().toLowerCase();
  }
  getDetalle(idreparto) {
    let req = {
      n_idrep_reparto: idreparto
    }
    this._general_service.getDetalleReporte(req, this.getToken().token).subscribe(
      result => {
        console.log(result)
        let resultado = < ResultadoApi > result;
        if (resultado.estado) {

          this.detalles = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }
  selectdepartamento(n_idgen_departamento) {
    this.iddepartamento = n_idgen_departamento;
    this.getProvincia(n_idgen_departamento);
  }
  selectprovincia(n_idgen_provincia) {
    this.idprovincia = n_idgen_provincia;
    this.getDistrito(n_idgen_provincia);
  }
  selectdistrito(n_idgen_distrito) {
    this.iddistrito = n_idgen_distrito;
    this.getCentroPoblado(n_idgen_distrito);
  }

  selectcentropoblado(n_idgen_centropoblado) {
    this.idcentropoblado = n_idgen_centropoblado;
  }

  selectentidad(n_idgen_entidad) {
    this.identidad = n_idgen_entidad;
    this.getUsuario(n_idgen_entidad);
  }

  selectperiodo(n_idgen_periodo) {
    this.idperiodo = n_idgen_periodo;
    //this.getTablaUsuarioubigeo();
  }

  selectusuario(n_idseg_user) {
    this.idusuario = n_idseg_user;
    //this.getTablaUsuarioubigeo();
  }
  descargarReparto(reparto) {
    this.getDetalle(reparto.n_idrep_reparto);
    console.log(reparto.n_idrep_reparto);
    console.log(this.detalles);
    let req = {
      n_idrep_reparto: reparto.n_idrep_reparto
    }
    this._general_service.imprimirReparto(req, this.getToken().token).subscribe(
      result => {
        let resultado = < ResultadoApi > result;
        console.log(result.data);
        if (resultado.estado) {
          result.data.forEach(element => {
            console.log(element.c_codigo);

            var espacio = 2
            var doc = new JsPDF();

            var img = new Image();
            img.src = '../../../../assets/images/logo_adinelsa.jpg';
            var espacio = 2;
            doc.addImage(img, 'JPEG', 12, espacio + 5, 45, 9.8);

            doc.setFontStyle('Calibri');
            doc.setFontSize(10); // Tamaño de la fuente
            doc.text('  EMPRESA DE ADMINISTRACIÓN DE', 138, espacio + 7, null, null); //(TEXTO ,inicio margen derecho,altura superior,,)
            doc.text('INFRAESTRUCTURA ELECTRICA S.A.', 138, espacio + 12, null, null);
            doc.setLineWidth(0.5);
            //(margen izquierda, margen superior inicial, tamaño largo, margen superior final)
            doc.line(11, espacio + 16, 200, espacio + 16);
            doc.setFontSize(14);
            doc.setFontStyle('bold');
            doc.text("CONSTANCIA DE ENTREGA DE RECIBOS", 105, espacio + 26, null, null, "center");
            doc.setFontSize(12);
            doc.setFontStyle("normal");
            espacio += 5;
            doc.text("SISTEMAS FOTOVOLTAICOS DOMESTICOS", 105, espacio + 26, null, null, "center");
            doc.setFontStyle("Calibri");

            espacio += 5;
            doc.setFontSize(10);
            doc.setFontStyle("bold");
            doc.text("SUMINISTRO N°:", 11, espacio + 40, null, null);
            doc.text(element.c_codigo, 50, espacio + 39.3, null, null);
            doc.setLineWidth(0.1)
            doc.line(50, espacio + 40, 90, espacio + 40) // horizontal line
            doc.setFontStyle("normal");
            doc.text("CODIGO:", 130, espacio + 35, null, null);
            doc.text("", 163, espacio + 35, null, null);
            espacio += 5;
            doc.text("FECHA Y HORA:", 130, espacio + 37, null, null);
            doc.text(element.c_fecha, 163, espacio + 37, null, null);
            doc.text("-", 182, espacio + 37, null, null);
            doc.text(element.c_hora, 184, espacio + 37, null, null);
            doc.setLineWidth(0.1)

            doc.setFontStyle('Calibri');
            espacio += 10;
            doc.text("NOMBRES Y APELLIDOS", 11, espacio + 37, null, null);
            doc.text(":", 56, espacio + 36.8, null, null);
            doc.setFontSize(9);
            doc.text(element.c_nombresapellidospe, 58, espacio + 36.5, null, null);
            doc.setFontSize(10);
            doc.line(58, espacio + 37, 105, espacio + 37) // horizontal line

            doc.text("DNI", 120, espacio + 37, null, null);
            doc.text(":", 149.3, espacio + 37, null, null);
            doc.setFontSize(9);
            doc.text(element.c_dni, 151, espacio + 36.5, null, null);
            doc.setFontSize(10);
            doc.line(151, espacio + 37, 202, espacio + 37) // horizontal line
            espacio += 10;
            doc.text("REGIÓN", 11, espacio + 37, null, null);
            doc.text(":", 56, espacio + 36.8, null, null);
            doc.setFontSize(9);
            doc.text(element.c_departamento, 58, espacio + 36.5, null, null);
            doc.setFontSize(10);
            doc.line(58, espacio + 37, 105, espacio + 37) // horizontal line

            doc.text("PROVINCIA", 120, espacio + 37, null, null);
            doc.text(":", 149.3, espacio + 37, null, null);
            doc.setFontSize(9);
            doc.text(element.c_provincia, 151, espacio + 36.5, null, null);
            doc.setFontSize(10);
            doc.line(151, espacio + 37, 202, espacio + 37) // horizontal line

            espacio += 10;
            doc.text("DISTRITO", 11, espacio + 37, null, null);
            doc.text(":", 56, espacio + 36.8, null, null);
            doc.setFontSize(9);
            doc.text(element.c_distrito, 58, espacio + 36.5, null, null);
            doc.setFontSize(10);
            doc.line(58, espacio + 37, 105, espacio + 37) // horizontal line

            doc.text("FECHA", 120, espacio + 37, null, null);
            doc.text(":", 149.3, espacio + 37, null, null);
            doc.setFontSize(9);
            doc.text(element.c_fecha, 151, espacio + 36.5, null, null);
            doc.setFontSize(10);
            doc.line(151, espacio + 37, 202, espacio + 37) // horizontal line

            espacio += 10;
            doc.text("LOCALIDAD", 11, espacio + 37, null, null);
            doc.text(":", 56, espacio + 36.8, null, null);
            doc.setFontSize(9);
            doc.text(element.c_centropoblado, 58, espacio + 36.5, null, null);
            doc.setFontSize(10);
            doc.line(58, espacio + 37, 118, espacio + 37) // horizontal line

            doc.text("COORDENADAS", 120, espacio + 37, null, null);
            doc.text("", 149.3, espacio + 37, null, null);
            espacio += 0.5;
            doc.setFontSize(8);
            doc.text(element.c_latitud, 151, espacio + 36, null, null);
            doc.text(element.c_longitud, 177.2, espacio + 36, null, null);
            doc.setFontSize(10);
            doc.line(151, espacio + 32, 151, espacio + 37) // vertical line
            doc.line(202, espacio + 32, 202, espacio + 37) // vertical line
            doc.line(177, espacio + 32, 177, espacio + 37) // vertical line
            doc.line(151, espacio + 32, 202, espacio + 32) // horizontal line
            doc.line(151, espacio + 37, 202, espacio + 37) // horizontal line


            doc.setFontStyle("bold");
            doc.text("POR EL CLIENTE", 11, espacio + 75, null, null);
            doc.text("POR EL TÉCNICO", 130, espacio + 75, null, null);
            doc.setFontStyle("normal");


            espacio += 65;
            let foto1 = this.detalles.find(x => x.n_fila == 3);
            if (foto1 != null) {
              var img = new Image();
              img.src = foto1.c_nombrefoto;
              doc.addImage(img, "JPEG", 29, espacio + 15, 45, 20);
            }
            //doc.addImage(imgData, 'JPEG', 29, espacio + 15, 45, 20)
            doc.text("FIRMA:", 11, espacio + 37, null, null);
            doc.line(25, espacio + 37, 80, espacio + 37) // horizontal line

            let foto2 = this.detalles.find(x => x.n_fila == 4);
            if (foto2 != null) {
              var img = new Image();
              img.src = foto2.c_nombrefoto;
              doc.addImage(img, "JPEG", 150, espacio + 15, 45, 20);
            }
            //doc.addImage(imgData, 'JPEG', 150, espacio + 15, 45, 20)
            doc.text("FIRMA:", 130, espacio + 37, null, null);
            doc.line(145, espacio + 37, 200, espacio + 37) // horizontal line

            espacio += 10;
            doc.text("NOMBRE:", 11, espacio + 37, null, null);
            doc.text(element.c_nombresapellidospe, 30, espacio + 36.5, null, null);
            doc.line(30, espacio + 37, 95, espacio + 37) // horizontal line

            doc.text("NOMBRE:", 130, espacio + 37, null, null);
            doc.text(element.c_tecnico, 149, espacio + 36.5, null, null);
            doc.line(149, espacio + 37, 200, espacio + 37) // horizontal line

            espacio += 10;
            doc.text("DNI:", 11, espacio + 37, null, null);
            doc.text(element.c_dni, 25, espacio + 36.5, null, null);
            doc.line(20, espacio + 37, 50, espacio + 37) // horizontal line

            doc.text("DNI:", 130, espacio + 37, null, null);
            doc.text(element.c_dnitecnico, 145, espacio + 36.5, null, null);
            doc.line(140, espacio + 37, 200, espacio + 37) // horizontal line

            espacio -= 10;
            doc.text("Foto 1", 11, espacio + 70, null, null);
            doc.text("Foto 2", 130, espacio + 70, null, null);
            espacio += 50;

            let foto3 = this.detalles.find(x => x.n_fila == 1);
            if (foto3 != null) {
              var img = new Image();
              img.src = foto3.c_nombrefoto;
              doc.addImage(img, "JPEG", 11, espacio + 15, 60, 60);
            }
            // doc.addImage(imgData, 'JPEG', 11, espacio + 25, 60, 60)
            let foto4 = this.detalles.find(x => x.n_fila == 2);
            if (foto4 != null) {
              var img = new Image();
              img.src = foto4.c_nombrefoto;
              doc.addImage(img, "JPEG", 130, espacio + 15, 60, 60);
            }
            // doc.addImage(imgData, 'JPEG', 130, espacio + 25, 60, 60)

            let nombrePDF = 'Acta_Reparto_' + element.c_codigo + '.pdf';
            doc.save(nombrePDF);
          });
        } else {
          this.openSnackBar(resultado.mensaje, 99);
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
