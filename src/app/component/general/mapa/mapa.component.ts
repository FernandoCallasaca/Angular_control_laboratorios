import {
  Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MapaService } from '../../../service/mapa.services';
import { AppSettings } from '../../../common/appsettings'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { BaseComponent } from '../../base/base.component';

// Genarl services
import { GeneralService } from '../../../service/general.service';
import { SeguridadService } from '../../../service/seguridad.service';
import { ResultadoApi } from '../../../interface/common.interface';
import { ExcelService } from '../../../service/excel.service';
import * as JsPDF from 'jspdf';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  providers: [SeguridadService, MapaService, GeneralService, ExcelService]
})
export class MapaComponent extends BaseComponent implements OnInit {

  @ViewChild('cris', {
    static: false
  }) cris: ElementRef;
  datas: any = [{
    eid: 'e101',
    ename: 'ravi',
    esal: 1000
  }, {
    eid: 'e102',
    ename: 'ram',
    esal: 2000
  }, {
    eid: 'e103',
    ename: 'rajesh',
    esal: 3000
  }];

  tit: String = 'MAPA DE ESTADO DE LOS PROYECTOS';

  lat: number = -12.088898333333335;
  lng: number = -77.00707333333334;
  zoom: number = 6;
  data: any;

  departamentos = [];
  provincias = [];
  distritos = [];
  centropoblados = [];
  entidades = [];
  puntos = [];
  dataexport = [];
  detalles = [];
  respuestas = [];
  lamparas = [];
  equipos = [];
  componentes = [];
  // Agregamos periodo
  periodos = [];
  // Agregamos Usuario
  usuarios = []
  // Agregamos arrego de mantenimientos
  mantenimientos = []

  iddepartamento: number = 0;
  idprovincia: number = 0;
  iddistrito: number = 0;
  idcentropoblado: number = 0;
  identidad: number = 0;
  // Inicializamos el periodo
  idperiodo: number = 0;
  idusuario: number = 0;
  idmantenimiento: number = 0;

  lastOpen: any = null;

  zona = [{
      id: 0,
      nombre: 'Norte'
    },
    {
      id: 1,
      nombre: 'Sur'
    }
  ]
  avance = [{
      id: 0,
      nombre: 'Conforme'
    },
    {
      id: 1,
      nombre: 'Retrazado'
    },
    {
      id: 2,
      nombre: 'Adelantado'
    }
  ]
  plazo = [{
      id: 0,
      nombre: 'Dentro'
    },
    {
      id: 1,
      nombre: 'Fuera'
    },
  ]
  estado = [{
      id: 0,
      nombre: 'En Ejecución'
    },
    {
      id: 1,
      nombre: 'Paralizado'
    },
    {
      id: 1,
      nombre: 'Terminado'
    },
  ]

  tabla: MatTableDataSource < any > ;
  displayedColumns: string[] = ['clave', 'valor', ];
  @ViewChild(MatPaginator, {
    static: false
  }) paginator: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sort: MatSort;

  tabla2: MatTableDataSource < any > ;
  displayedColumns2: string[] = ['clave', 'valor', ];
  @ViewChild(MatPaginator, {
    static: false
  }) paginator2: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sort2: MatSort;

  tabla3: MatTableDataSource < any > ;
  displayedColumns3: string[] = ['clave', 'valor', 'descarga'];
  @ViewChild(MatPaginator, {
    static: false
  }) paginator3: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sort3: MatSort;

  tablaDetalle: MatTableDataSource < any > ;
  displayedColumnsDetalle: string[] = ['valor0', 'valor1', 'valor2', 'valor3'];
  @ViewChild(MatPaginator, {
    static: false
  }) paginatorDetalle: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sortDetalle: MatSort;

  tablaarchivo: MatTableDataSource < any > ;
  displayedColumnsArchivo: string[] = ['clave', 'valor', 'descarga'];
  @ViewChild(MatPaginator, {
    static: false
  }) paginatorArchivo: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sortArchivo: MatSort;

  geoJsonObject: Object;
  markers = [];

  constructor(public snackBar: MatSnackBar,
    public router: Router,
    public _mapa_service: MapaService,
    public dialog: MatDialog,
    private excelService: ExcelService,
    public _general_service: GeneralService,
    public _seguridad_service: SeguridadService,

  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.getPeriodo();
    this.getDepartamento();
    this.getEntidad();
    this.getMantenimiento();
    this.get();
  }

  getTablaDetalle(data) {
    console.log(data);
    this.tablaDetalle = new MatTableDataSource < any > (data);
    this.tablaDetalle.sort = this.sortDetalle;
    this.tablaDetalle.paginator = this.paginatorDetalle;
  }

  get() {
    let req = {
      n_idgen_departamento: this.iddepartamento,
      n_idgen_provincia: this.idprovincia,
      n_idgen_distrito: this.iddistrito,
      n_idgen_centropoblado: this.idcentropoblado,
      n_idgen_entidad: this.identidad,
      n_idgen_periodo: this.idperiodo,
      n_idseg_user: this.idusuario,
      n_idgen_mantenimiento: this.idmantenimiento

    }
    console.log("asdfa");
    //console.log(req.toString());

    this._mapa_service.get(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.markers = [];
          this.puntos = resultado.data;
          result.data.forEach(element => {
            console.log(element)
            let marker = {
              lat: element.c_latitud,
              lng: element.c_longitud,
              label: 'A',
              alpha: 1,
              data: element,
              fechamantenimiento: element.c_fecha + ' ' + element.c_hora,
              url: './assets/map/icono-deppol.svg'
            };
            this.markers.push(marker);
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

  getxls() {
    let req = {
      n_idgen_departamento: this.iddepartamento,
      n_idgen_provincia: this.idprovincia,
      n_idgen_distrito: this.iddistrito,
      n_idgen_centropoblado: this.idcentropoblado,
      n_idgen_entidad: this.identidad,

    }
    this._mapa_service.getxls(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.dataexport = resultado.data;

          this.excelService.exportAsExcelFile(this.dataexport, 'Reporte Encuestas');
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

  getDetalle(idencuesta) {
    let req = {
      n_idmnt_sistemafotovoltaico: idencuesta
    }
    this._mapa_service.getDetalle(req, this.getToken().token).subscribe(
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

  getMantenimiento() {
    let request = {

    };
    this._general_service.getMantenimiento(this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.mantenimientos = resultado.data;
        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });

  }

  onMouseOver(infoWindow, marker) {
    console.log(marker);
    if (this.lastOpen != null) {
      this.lastOpen.close();
    }

    this.lastOpen = infoWindow;
    infoWindow.open();
    this.getTablaDetalle(marker.data.detalle);
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

  selectmantenimiento(n_idgen_mantenimiento) {
    this.idmantenimiento = n_idgen_mantenimiento;
    //
  }

  clicked(marker) {
    this.getDetalle(marker.data.n_idmnt_sistemafotovoltaico);
    //this.getDetalle(36);
    console.log(marker.data.n_idmnt_sistemafotovoltaico)
  }

  export () {
    this.getxls();
  }

  /*openPdf() {
    this.pdfmake.open();
  }

  printPdf() {
    this.pdfmake.print();
  }

  downloadPDF() {
    this.pdfmake.download();
  }

  downloadPdfWithName(customName: string) {
    this.pdfmake.download(customName);
  }*/

  downloadMantenimiento2(marker) {

    let specialElementHandlers = {
      '#editor': function (element, render) {
        return true;
      }
    };

    let req = {
      n_idmnt_sistemafotovoltaico: marker.n_idmnt_sistemafotovoltaico
    }
    this._mapa_service.getRespuesta(req, this.getToken().token).subscribe(
      result => {
        console.log(result)
        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.respuestas = resultado.data;

          this._mapa_service.getEquipos(req, this.getToken().token).subscribe(
            result => {
              let resultado = < ResultadoApi > result;
              if (resultado.estado) {
                this.equipos = resultado.data;

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
                doc.text('ACTA DE MANTENIMIENTO PREVENTIVO', 105, espacio + 26, null, null, 'center');
                doc.setFontSize(8);
                doc.setFontStyle('Bold');
                doc.setFontStyle('Calibri Light');

                espacio += 10;
                var espacio1 = espacio;
                doc.setFontSize(9);
                doc.setFontStyle('bold');
                doc.text('DATOS GENERALES DEL USUARIO', 11, espacio + 26, null, null);
                doc.setLineWidth(0);
                doc.setFontStyle('normal');

                espacio += 10;
                doc.line(11, espacio + 21, 11, espacio + 66) // vertical line
                doc.line(106, espacio + 21, 106, espacio + 66) // vertical line
                doc.line(11, espacio + 21, 106, espacio + 21);
                doc.text('SUMINISTRO', 12, espacio + 24.65, null, null);
                doc.text(':', 40, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text(marker.c_codigo, 43, espacio + 24.65, null, null);

                espacio += 5;
                doc.text('CLIENTE', 12, espacio + 24.65, null, null);
                doc.text(':', 40, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 43, espacio + 24.65, null, null);

                espacio += 5;
                doc.text('DNI', 12, espacio + 24.65, null, null);
                doc.text(':', 40, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text(marker.c_dni, 43, espacio + 24.65, null, null);

                espacio += 5;
                doc.text('LOCALIDAD', 12, espacio + 24.65, null, null);
                doc.text(':', 40, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text(marker.c_centropoblado, 43, espacio + 24.65, null, null);

                espacio += 5;
                doc.text('DISTRITO', 12, espacio + 24.65, null, null);
                doc.text(':', 40, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text(marker.c_distrito, 43, espacio + 24.65, null, null);

                espacio += 5;
                doc.text('PROVINCIA', 12, espacio + 24.65, null, null);
                doc.text(':', 40, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text(marker.c_provincia, 43, espacio + 24.65, null, null);

                espacio += 5;
                doc.text('REGION', 12, espacio + 24.65, null, null);
                doc.text(':', 40, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text(marker.c_departamento, 43, espacio + 24.65, null, null);

                espacio += 5;
                doc.setFontSize(7.5);
                doc.text('ESTADO DE LA INSTALACIÓN FOTOVOLTAICA ¿Operativo?', 12, espacio + 24.5, null, null);
                doc.setLineWidth(0);
                doc.text('SI', 89, espacio + 24.5, null, null);
                doc.text(this.respuestas[0].p1 == 1 ? 'X' : '', 93, espacio + 24.5, null, null);
                doc.text('NO', 97, espacio + 24.5, null, null);
                doc.text(this.respuestas[0].p1 != 1 ? 'X' : '', 102.5, espacio + 24.5, null, null);

                doc.line(88, espacio + 21, 88, espacio + 26) // vertical line
                doc.line(92, espacio + 21, 92, espacio + 26) // vertical line
                doc.line(96, espacio + 21, 96, espacio + 26) // vertical line
                doc.line(101.5, espacio + 21, 101.5, espacio + 26) // vertical line
                doc.line(11, espacio + 26, 106, espacio + 26);

                // COORDENADAS
                espacio += 5;
                doc.text('LATITUD', 12, espacio + 24.65, null, null);
                doc.text(marker.c_latitud, 28, espacio + 24.5, null, null);
                doc.line(11, espacio + 26, 106, espacio + 26);
                doc.text('LONGITUD', 60, espacio + 24.65, null, null);
                doc.text(marker.c_longitud, 77, espacio + 24.5, null, null);
                doc.line(25, espacio + 21, 25, espacio + 26) // vertical line
                doc.line(58, espacio + 21, 58, espacio + 26) // vertical line
                doc.line(75, espacio + 21, 75, espacio + 26) // vertical line

                // -------------------DATOS DEL EJECUTANTE------------------
                doc.setFontSize(9);
                doc.setFontStyle('bold');
                doc.text('DATOS DEL EJECUTANTE', 135, espacio1 + 26, null, null);
                doc.setLineWidth(0);
                doc.setFontStyle('normal');

                espacio1 += 10;
                doc.line(110, espacio1 + 21, 110, espacio1 + 61) // vertical line
                doc.line(200, espacio1 + 21, 200, espacio1 + 61) // vertical line
                doc.line(110, espacio1 + 21, 200, espacio1 + 21);
                doc.text('ACTIVIDAD', 111, espacio1 + 24.65, null, null);
                doc.text(':', 154, espacio1 + 24.5, null, null);
                doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                doc.text('Mantenimiento Preventivo', 155, espacio1 + 24.65, null, null);

                espacio1 += 5;
                doc.text('CONTRATISTA', 111, espacio1 + 24.65, null, null);
                doc.text(':', 154, espacio1 + 24.5, null, null);
                doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                doc.setFontStyle('bold');
                doc.text(marker.c_entidad, 155, espacio1 + 24.65, null, null);
                doc.setFontStyle('Normal');

                espacio1 += 5;
                doc.text('SUPERVISOR RESPONSABLE', 111, espacio1 + 24.65, null, null);
                doc.text(':', 154, espacio1 + 24.5, null, null);
                doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                doc.text('', 155, espacio1 + 24.65, null, null);

                espacio1 += 5;
                doc.text('TECNICO EJECUTOR', 111, espacio1 + 24.65, null, null);
                doc.text(':', 154, espacio1 + 24.5, null, null);
                doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                doc.text(marker.c_tecnico, 155, espacio1 + 24.65, null, null);

                espacio1 += 5;
                doc.text('FECHA DE INTERVENCIÓN', 111, espacio1 + 24.65, null, null);
                doc.text(':', 154, espacio1 + 24.5, null, null);
                doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                doc.text(marker.c_fecha, 155, espacio1 + 24.65, null, null);

                espacio1 += 5;
                doc.text('HORA DE ATENCIÓN', 111, espacio1 + 24.65, null, null);
                doc.text(':', 154, espacio1 + 24.5, null, null);
                doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                doc.text(marker.c_hora, 155, espacio1 + 24.65, null, null);

                espacio1 += 5;
                doc.text('OBSERVACIÓN: ', 111, espacio1 + 24.65, null, null);
                doc.line(110, espacio1 + 31, 200, espacio1 + 31);
                doc.text(marker.c_observacion.toString(), 135, espacio1 + 24.65, null, null);

                //----------------------------TRABAJO A EJECUTARSE-------------------------

                espacio += 15;
                doc.line(11, espacio + 16, 100, espacio + 16); // Linea Horizontal Up
                doc.line(11, espacio + 16, 11, espacio + 46); // vertical line
                doc.line(80, espacio + 16, 80, espacio + 46); // vertical line
                doc.line(90, espacio + 16, 90, espacio + 46); // vertical line
                doc.line(100, espacio + 16, 100, espacio + 46); // vertical line
                doc.line(11, espacio + 46, 100, espacio + 46); // LineaHorizontal FInal

                doc.line(110, espacio + 16, 200, espacio + 16); // Linea Horizontal Up
                doc.line(110, espacio + 16, 110, espacio + 71); // vertical line
                doc.line(183.8, espacio + 16, 183.8, espacio + 66); // vertical line
                doc.line(192, espacio + 16, 192, espacio + 66); // vertical line
                doc.line(200, espacio + 16, 200, espacio + 71); // vertical line
                doc.line(110, espacio + 71, 200, espacio + 71); // LineaHorizontal FInal

                doc.setFontSize(9);
                doc.text('TRABAJO A EJECUTARSE', 13, espacio + 19.5, null, null, null);
                doc.text('SI', 85, espacio + 19.5, null, null, 'center');
                doc.text('NO', 95, espacio + 19.5, null, null, 'center');

                // PANEL

                doc.text('TRABAJOS REALIZADOS EN EL PANEL', 112, espacio + 19.5, null, null, null);
                doc.text('SI', 188, espacio + 19.5, null, null, 'center');
                doc.text('NO', 196, espacio + 19.5, null, null, 'center');

                doc.setFontSize(7.5);
                espacio += 5;
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Inspección minuciosa del panel fotovoltaico', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p2 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p2 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                doc.setFontSize(7.5);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Inspección visual de posibles obstáculos que hacen sombra al panel', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p7 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p7 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                doc.setFontSize(7.5);
                espacio += 5;
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Inspección minuciosa del controlador de carga', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p3 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p3 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Retiro de obstáculos y malezas que hacen sombra al panel', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p8 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p8 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5;
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Inspección minuciosa de la bateria', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p4 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p4 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');


                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Inspección visual de posibles degradaciones en el panel', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p9 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p9 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5;
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Inspección minuciosa de las lamparas', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p5 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p5 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Limpieza y ajustes de los pernos que unen el soporte al panel', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p10 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p10 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5;
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Mentenimiento Preventivo(Limpieza, ajustes y mediciones)', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p6 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p6 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Limpieza de los contactos de las borneras del panel', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p11 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p11 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Revisión de conexiones y cableado del panel fotovoltaico', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p12 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p12 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Limpieza de crecimiento de hongos sobre la superficie del panel', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p13 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p13 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Revisión de la orientación del panel al norte', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p14 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p14 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Revisión de la verticalidad del mastil ± 5º', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p15 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p15 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Tipo de mastil (madera/metal)', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p17 == 1 ? 'MADERA' : 'METAL', 160, espacio + 19.5, null, null);
                doc.text('Estado', 175, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p16 == 1 ? 'BUENO' : 'MALO', 190, espacio + 19.5, null, null);
                doc.line(157, espacio + 16, 157, espacio + 21); // vertical line
                doc.line(171, espacio + 16, 171, espacio + 21); // vertical line
                doc.line(186, espacio + 16, 186, espacio + 21); // vertical line



                /* TRABAJOS REALIZADOS EN LA BATERIA */
                espacio -= 15;

                doc.line(11, espacio + 16, 100, espacio + 16); // Linea Horizontal Up
                doc.line(11, espacio + 16, 11, espacio + 51) // vertical line
                doc.line(80, espacio + 16, 80, espacio + 51) // vertical line
                doc.line(90, espacio + 16, 90, espacio + 51) // vertical line
                doc.line(100, espacio + 16, 100, espacio + 51) // vertical line
                doc.line(11, espacio + 41, 100, espacio + 41); // LineaHorizontal FInal

                let equipo2 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Batería');
                let equipo3 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Controlador de Carga');

                doc.setFontSize(8);
                doc.text('TRABAJOS REALIZADOS EN LA BATERIA', 13, espacio + 19.5, null, null, null);
                doc.text('SI', 85, espacio + 19.5, null, null, 'center');
                doc.text('NO', 95, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Limpieza y retiro del oxido de las borneras de la bateria', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p18 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p18 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Ajustes de los terminales y cables', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p19 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p19 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                doc.setFontSize(7.5);
                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Verificación del estado de la caja y cubierta de la bateria', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p20 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p20 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Limpieza de la bateria con trapo humedo', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p21 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p21 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.line(11, espacio + 26, 100, espacio + 26);
                doc.text('Revisión del nivel electrolito y rellenado de la batería con agua', 12, espacio + 19.5, null, null);
                doc.text('destilada', 12, espacio + 23, null, null);
                doc.text(this.respuestas[0].p22 == 1 ? 'X' : '', 85, espacio + 21.5, null, null, 'center');
                doc.text(this.respuestas[0].p22 != 1 ? 'X' : '', 95, espacio + 21.5, null, null, 'center');

                espacio += 10

                // CONTROLADOR
                espacio -= 10;
                doc.line(110, espacio + 16, 200, espacio + 16); // Linea Horizontal Up
                doc.line(110, espacio + 16, 110, espacio + 59); // vertical line
                doc.line(183.8, espacio + 16, 183.8, espacio + 59); // vertical line
                doc.line(192, espacio + 16, 192, espacio + 59); // vertical line
                doc.line(200, espacio + 16, 200, espacio + 59); // vertical line
                doc.line(110, espacio + 59, 200, espacio + 59); // LineaHorizontal FInal

                doc.setFontSize(9);
                doc.text('TRABAJOS REALIZADOS EN EL CONTROLADOR', 112, espacio + 19.5, null, null, null);
                doc.text('SI', 188, espacio + 19.5, null, null, 'center');
                doc.text('NO', 196, espacio + 19.5, null, null, 'center');

                espacio += 5;
                doc.setFontSize(8);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Limpieza del polvo acumulado en la superficie del controlador', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p23 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p23 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                espacio += 5;
                doc.setFontSize(7);
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Revision de indicadores del controlador respecto al estado de carga', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p24 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p24 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                espacio += 5;
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Ajustes de los cables de entrada y salida del controlador', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p25 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p25 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');


                doc.setFontSize(8);
                espacio += 5;
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Limpieza de las borneras de oxido y sulfatación', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p26 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p26 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                espacio += 5;
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Revisión y limpieza de los contactos de fusibles', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p27 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p27 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                espacio += 5;
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Revisión de la temperatura de operación del controlador', 111, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p28 == 1 ? 'X' : '', 188, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p28 != 1 ? 'X' : '', 196, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                espacio += 5;
                doc.line(110, espacio + 16, 200, espacio + 16);
                doc.text('Descarga de los parámetros de la memoria del controlador y', 111, espacio + 19.5, null, null);
                doc.text('configuración', 111, espacio + 23, null, null);
                doc.text(this.respuestas[0].p29 == 1 ? 'X' : '', 188, espacio + 21.5, null, null, 'center');
                doc.text(this.respuestas[0].p29 != 1 ? 'X' : '', 196, espacio + 21.5, null, null, 'center');

                espacio += 9;

                /* TRABAJOS REALIZADOS EN LAS LAMPARAS   */
                espacio -= 29;

                doc.line(11, espacio + 16, 100, espacio + 16); // Linea Horizontal Up
                doc.line(11, espacio + 16, 11, espacio + 42) // vertical line
                doc.line(80, espacio + 16, 80, espacio + 42) // vertical line
                doc.line(90, espacio + 16, 90, espacio + 42) // vertical line
                doc.line(100, espacio + 16, 100, espacio + 42) // vertical line
                doc.line(11, espacio + 42, 100, espacio + 42); // LineaHorizontal FInal

                //let equipo2 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Batería');
                //let equipo3 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Controlador de Carga');

                doc.setFontSize(8);
                doc.text('TRABAJOS REALIZADOS EN LAS LAMPARAS', 13, espacio + 19.5, null, null, null);
                doc.text('SI', 85, espacio + 19.5, null, null, 'center');
                doc.text('NO', 95, espacio + 19.5, null, null, 'center');

                doc.setFontSize(8);
                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Limpieza de polvo acumulado en la superficie de la lámpara', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p30 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p30 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Verificacion de lámparas que no cumplen con la norma', 12, espacio + 19.5, null, null);
                doc.text('técnica de calidad para sfvd', 12, espacio + 23, null, null);
                doc.text(this.respuestas[0].p31 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p31 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                doc.setFontSize(7.5);
                espacio += 8
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Inspeccion y fijacion firme de las luminarias (sockets).', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p32 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p32 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                /* ESTADO DE LAS INSTALACIONES INTERNAS CABLES Y ACCESORIOS  */
                espacio += 13;

                doc.line(11, espacio + 16, 100, espacio + 16); // Linea Horizontal Up
                doc.line(11, espacio + 16, 11, espacio + 46) // vertical line
                doc.line(80, espacio + 16, 80, espacio + 46) // vertical line
                doc.line(90, espacio + 16, 90, espacio + 46) // vertical line
                doc.line(100, espacio + 16, 100, espacio + 46) // vertical line
                doc.line(11, espacio + 46, 100, espacio + 46); // LineaHorizontal FInal

                //let equipo2 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Batería');
                //let equipo3 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Controlador de Carga');

                doc.setFontSize(8);
                doc.text('ESTADO DE LAS INSTALACIONES INTERNAS', 13, espacio + 19.5, null, null, null);
                espacio += 5
                doc.text('CABLES Y ACCESORIOS', 13, espacio + 19.5, null, null, null);
                doc.text('SI', 85, espacio + 17.5, null, null, 'center');
                doc.text('NO', 95, espacio + 17.5, null, null, 'center');

                doc.setFontSize(8);
                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Cable panel - controlador ¿Operativo?', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p33 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p33 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Cable controlador - batería ¿Operativo?', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p34 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p34 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Cable controlador - ITM ¿Operativo?', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p35 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p35 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');

                espacio += 5
                doc.line(11, espacio + 16, 100, espacio + 16);
                doc.text('Cable ITM - Instalaciones internas ¿Operativo?', 12, espacio + 19.5, null, null);
                doc.text(this.respuestas[0].p36 == 1 ? 'X' : '', 85, espacio + 19.5, null, null, 'center');
                doc.text(this.respuestas[0].p36 != 1 ? 'X' : '', 95, espacio + 19.5, null, null, 'center');
                espacio += 8



                // Firmas
                espacio = 245;
                doc.line(15, espacio + 16, 70, espacio + 16);
                doc.line(77, espacio + 16, 133, espacio + 16);
                doc.line(140, espacio + 16, 196, espacio + 16);

                doc.setFontStyle('bold');
                doc.text('USUARIO:', 15, espacio - 5, null, null);
                let foto11 = this.detalles.find(x => x.n_fila == 11);
                if (foto11 != null) {
                  var img = new Image()
                  img.src = foto11.c_nombrefoto;
                  doc.addImage(img, 'JPEG', 18, espacio - 3, 50, 18);
                }
                //var imgData = ''
                //doc.addImage(imgData, 'JPEG', 18, espacio-3, 50, 18)

                doc.text('SUPERVISOR:', 77, espacio - 5, null, null);
                /*let foto13 = this.detalles.find(x => x.n_fila == 13);
                if(foto13!=null){
                  var img = new Image()
                  img.src = foto13.c_nombrefoto;
                  doc.addImage(img, 'JPEG', 80, espacio-3, 50, 18);
                }*/
                //var imgData = ''
                //doc.addImage(imgData, 'JPEG', 80, espacio-3, 50, 18)

                doc.text('TECNICO:', 140, espacio - 5, null, null);
                let foto12 = this.detalles.find(x => x.n_fila == 12);
                if (foto12 != null) {
                  var img = new Image()
                  img.src = foto12.c_nombrefoto;
                  doc.addImage(img, 'JPEG', 143, espacio - 3, 50, 18);
                }
                //var imgData = ''
                //doc.addImage(imgData, 'JPEG', 143, espacio-3, 50, 18)
                doc.setFontStyle('normal');

                doc.text('Nombre:', 15, espacio + 20.5);
                doc.setFontSize(7);
                doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 30, espacio + 20.5);
                doc.setFontSize(7.5);
                doc.text('Nombre:', 77, espacio + 20.5);
                doc.text('', 92, espacio + 20.5);
                doc.text('Nombre:', 140, espacio + 20.5);
                doc.text(marker.c_tecnico, 155, espacio + 20.5);

                espacio += 5;
                doc.text('DNI:', 15, espacio + 20.5);
                doc.text(marker.c_dni, 30, espacio + 20.5);
                doc.text('DNI:', 77, espacio + 20.5);
                doc.text('', 92, espacio + 20.5);
                doc.text('DNI:', 140, espacio + 20.5);
                doc.text(marker.c_dnitecnico, 155, espacio + 20.5);

                espacio += 5;
                doc.text('Parentesco:', 15, espacio + 20.5);
                doc.text('', 30, espacio + 20.5);

                //----------------------------------------------- other page

                doc.addPage();
                doc.setFontSize(10);

                var espacio = 2

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
                doc.setFontSize(10);
                doc.setFontStyle('bold');
                doc.text('SUMINISTRO: ', 11, espacio + 22.5, null, null);
                doc.text(marker.c_codigo, 40, espacio + 22.5, null, null);
                doc.setFontStyle('Bold');
                doc.setFontStyle('Calibri Light');

                // FOTOS
                espacio += 10;

                let foto1 = this.detalles.find(x => x.n_fila == 1);
                if (foto1 != null) {
                  doc.text(foto1.c_tipo, 15, espacio + 20);
                  var img = new Image();
                  img.src = foto1.c_nombrefoto;
                  doc.addImage(img, "JPEG", 15, espacio + 25, 50, 50);
                }

                let foto2 = this.detalles.find(x => x.n_fila == 2);
                if (foto2 != null) {
                  doc.text(foto2.c_tipo, 75, espacio + 20);
                  var img = new Image()
                  img.src = foto2.c_nombrefoto;
                  doc.addImage(img, "JPEG", 75, espacio + 25, 50, 50);
                }

                let foto3 = this.detalles.find(x => x.n_fila == 3);
                if (foto3 != null) {
                  doc.text(foto3.c_tipo, 135, espacio + 20);
                  var img = new Image()
                  img.src = foto3.c_nombrefoto;
                  doc.addImage(img, "JPEG", 135, espacio + 25, 50, 50);
                }

                let foto4 = this.detalles.find(x => x.n_fila == 4);
                if (foto4 != null) {
                  doc.text(foto4.c_tipo, 15, espacio + 80);
                  var img = new Image()
                  img.src = foto4.c_nombrefoto;
                  doc.addImage(img, "JPEG", 15, espacio + 85, 50, 50);
                }

                let foto5 = this.detalles.find(x => x.n_fila == 5);
                if (foto5 != null) {
                  doc.text(foto5.c_tipo, 75, espacio + 80);
                  var img = new Image()
                  img.src = foto5.c_nombrefoto;
                  doc.addImage(img, "JPEG", 75, espacio + 85, 50, 50);
                }

                let foto6 = this.detalles.find(x => x.n_fila == 6);
                if (foto6 != null) {
                  doc.text(foto6.c_tipo, 135, espacio + 80);
                  var img = new Image()
                  img.src = foto6.c_nombrefoto;
                  doc.addImage(img, "JPEG", 135, espacio + 85, 50, 50);
                }

                let foto7 = this.detalles.find(x => x.n_fila == 7);
                if (foto7 != null) {
                  doc.text(foto7.c_tipo, 15, espacio + 140);
                  var img = new Image()
                  img.src = foto7.c_nombrefoto;
                  doc.addImage(img, "JPEG", 15, espacio + 145, 50, 50);
                }

                let foto8 = this.detalles.find(x => x.n_fila == 8);
                if (foto8 != null) {
                  doc.text(foto8.c_tipo, 75, espacio + 140);
                  var img = new Image()
                  img.src = foto8.c_nombrefoto;
                  doc.addImage(img, "JPEG", 75, espacio + 145, 50, 50);
                }

                let foto9 = this.detalles.find(x => x.n_fila == 9);
                if (foto9 != null) {
                  doc.text(foto9.c_tipo, 135, espacio + 140);
                  var img = new Image()
                  img.src = foto9.c_nombrefoto;
                  doc.addImage(img, "JPEG", 135, espacio + 145, 50, 50);
                }

                let foto10 = this.detalles.find(x => x.n_fila == 10);
                if (foto10 != null) {
                  doc.text(foto10.c_tipo, 15, espacio + 200);
                  var img = new Image()
                  img.src = foto10.c_nombrefoto;
                  doc.addImage(img, "JPEG", 15, espacio + 205, 50, 50);
                }

                let nombrePDF = 'Acta_Mantenimiento_' + marker.c_codigo + '.pdf';
                doc.save(nombrePDF);


              }
            }, error => {
              try {
                this.openSnackBar(error.error.Detail, error.error.StatusCode);
              } catch (error) {
                this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
              }
            });

        }
      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });

  }


  downloadInspeccion(marker) {
    let doc = new JsPDF();

    let specialElementHandlers = {
      '#editor': function (element, render) {
        return true;
      }
    };

    let req = {
      n_idmnt_sistemafotovoltaico: marker.n_idmnt_sistemafotovoltaico
    }
    this._mapa_service.getRespuesta(req, this.getToken().token).subscribe(
      result => {
        console.log(result)
        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.respuestas = resultado.data;

          this._mapa_service.getLamparas(req, this.getToken().token).subscribe(
            result => {
              console.log(result)
              let resultado = < ResultadoApi > result;
              if (resultado.estado) {
                this.lamparas = resultado.data;

                this._mapa_service.getEquipos(req, this.getToken().token).subscribe(
                  result => {
                    console.log(result)
                    let resultado = < ResultadoApi > result;
                    if (resultado.estado) {

                      this.equipos = resultado.data;

                      this._mapa_service.getComponentes(req, this.getToken().token).subscribe(
                        result => {
                          console.log(result)
                          let resultado = < ResultadoApi > result;
                          if (resultado.estado) {

                            this.componentes = resultado.data;

                            var img = new Image()
                            img.src = '../../../../assets/images/logo_adinelsa.jpg';
                            var espacio = 2
                            doc.addImage(img, 'JPEG', 12, espacio + 5, 45, 9.8);

                            doc.setFontStyle('Arial Narrow');
                            doc.setFontSize(10); // Tamaño de la fuente
                            doc.text('  EMPRESA DE ADMINISTRACIÓN DE', 138, espacio + 7, null, null); //(TEXTO ,inicio margen derecho,altura superior,,)
                            doc.text('INFRAESTRUCTURA ELECTRICA S.A.', 138, espacio + 12, null, null);
                            doc.setLineWidth(0.5);

                            //(margen izquierda, margen superior inicial, tamaño largo, margen superior final)
                            doc.line(11, espacio + 16, 200, espacio + 16);
                            doc.setFontSize(14);
                            doc.setFontStyle('bold');
                            doc.text('ACTA DE INSPECCIÓN INVENTARIO', 105, espacio + 24, null, null, 'center');
                            doc.setFontSize(8);
                            doc.setFontStyle('Bold');
                            doc.setFontStyle('Calibri Light');

                            espacio += 8;
                            var espacio1 = espacio;
                            doc.setFontSize(9);
                            doc.setFontStyle('bold');
                            doc.text('DATOS GENERALES DEL USUARIO', 11, espacio + 26, null, null);
                            doc.setLineWidth(0);
                            doc.setFontStyle('normal');

                            espacio += 9;
                            doc.line(11, espacio + 21, 11, espacio + 66) // vertical line
                            doc.line(106, espacio + 21, 106, espacio + 66) // vertical line
                            doc.line(11, espacio + 21, 106, espacio + 21);
                            doc.text('SUMINISTRO', 12, espacio + 24.65, null, null);
                            doc.text(':', 40, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text(marker.c_codigo, 43, espacio + 24.65, null, null);

                            espacio += 5;
                            doc.text('CLIENTE', 12, espacio + 24.65, null, null);
                            doc.text(':', 40, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 43, espacio + 24.65, null, null);

                            espacio += 5;
                            doc.text('DNI', 12, espacio + 24.65, null, null);
                            doc.text(':', 40, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text(marker.c_dni, 43, espacio + 24.65, null, null);

                            espacio += 5;
                            doc.text('LOCALIDAD', 12, espacio + 24.65, null, null);
                            doc.text(':', 40, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text(marker.c_centropoblado, 43, espacio + 24.65, null, null);

                            espacio += 5;
                            doc.text('DISTRITO', 12, espacio + 24.65, null, null);
                            doc.text(':', 40, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text(marker.c_distrito, 43, espacio + 24.65, null, null);

                            espacio += 5;
                            doc.text('PROVINCIA', 12, espacio + 24.65, null, null);
                            doc.text(':', 40, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text(marker.c_provincia, 43, espacio + 24.65, null, null);

                            espacio += 5;
                            doc.text('REGION', 12, espacio + 24.65, null, null);
                            doc.text(':', 40, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text(marker.c_departamento, 43, espacio + 24.65, null, null);

                            espacio += 5;
                            doc.setFontSize(7.5);
                            doc.text('ESTADO DE LA INSTALACIÓN FOTOVOLTAICA ¿Operativo?', 12, espacio + 24.5, null, null);
                            doc.setLineWidth(0);
                            doc.text('SI', 89, espacio + 24.5, null, null);
                            doc.text(this.respuestas[0].p1 == 1 ? 'X' : '', 93, espacio + 24.5, null, null);
                            doc.text('NO', 97, espacio + 24.5, null, null);
                            doc.text(this.respuestas[0].p1 != 1 ? 'X' : '', 102.5, espacio + 24.5, null, null);

                            doc.line(88, espacio + 21, 88, espacio + 26) // vertical line
                            doc.line(92, espacio + 21, 92, espacio + 26) // vertical line
                            doc.line(96, espacio + 21, 96, espacio + 26) // vertical line
                            doc.line(101.5, espacio + 21, 101.5, espacio + 26) // vertical line
                            doc.line(11, espacio + 26, 106, espacio + 26);

                            // COORDENADAS
                            espacio += 5;
                            doc.text('LATITUD', 12, espacio + 24.65, null, null);
                            doc.text(marker.c_latitud, 28, espacio + 24.5, null, null);
                            doc.line(11, espacio + 26, 106, espacio + 26);
                            doc.text('LONGITUD', 60, espacio + 24.65, null, null);
                            doc.text(marker.c_longitud, 77, espacio + 24.5, null, null);
                            doc.line(25, espacio + 21, 25, espacio + 26) // vertical line
                            doc.line(58, espacio + 21, 58, espacio + 26) // vertical line
                            doc.line(75, espacio + 21, 75, espacio + 26) // vertical line

                            // -------------------DATOS DEL EJECUTANTE------------------
                            doc.setFontSize(9);
                            doc.setFontStyle('bold');
                            doc.text('DATOS DEL EJECUTANTE', 135, espacio1 + 26, null, null);
                            doc.setLineWidth(0);
                            doc.setFontStyle('normal');

                            espacio1 += 9;
                            doc.line(110, espacio1 + 21, 110, espacio1 + 61) // vertical line
                            doc.line(200, espacio1 + 21, 200, espacio1 + 61) // vertical line
                            doc.line(110, espacio1 + 21, 200, espacio1 + 21);
                            doc.text('ACTIVIDAD', 111, espacio1 + 24.65, null, null);
                            doc.text(':', 154, espacio1 + 24.5, null, null);
                            doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                            doc.text('Inspección Inventario', 155, espacio1 + 24.65, null, null);

                            espacio1 += 5;
                            doc.text('CONTRATISTA', 111, espacio1 + 24.65, null, null);
                            doc.text(':', 154, espacio1 + 24.5, null, null);
                            doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                            doc.setFontStyle('bold');
                            doc.text(marker.c_entidad, 155, espacio1 + 24.65, null, null);
                            doc.setFontStyle('Normal');

                            espacio1 += 5;
                            doc.text('SUPERVISOR RESPONSABLE', 111, espacio1 + 24.65, null, null);
                            doc.text(':', 154, espacio1 + 24.5, null, null);
                            doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                            doc.text('', 155, espacio1 + 24.65, null, null);

                            espacio1 += 5;
                            doc.text('TECNICO EJECUTOR', 111, espacio1 + 24.65, null, null);
                            doc.text(':', 154, espacio1 + 24.5, null, null);
                            doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                            doc.text(marker.c_tecnico, 155, espacio1 + 24.65, null, null);

                            espacio1 += 5;
                            doc.text('FECHA DE INTERVENCIÓN', 111, espacio1 + 24.65, null, null);
                            doc.text(':', 154, espacio1 + 24.5, null, null);
                            doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                            doc.text(marker.c_fecha, 155, espacio1 + 24.65, null, null);

                            espacio1 += 5;
                            doc.text('HORA DE ATENCIÓN', 111, espacio1 + 24.65, null, null);
                            doc.text(':', 154, espacio1 + 24.5, null, null);
                            doc.line(110, espacio1 + 26, 200, espacio1 + 26);
                            doc.text(marker.c_hora, 155, espacio1 + 24.65, null, null);

                            espacio1 += 5;
                            doc.text('OBSERVACIÓN: ', 111, espacio1 + 24.65, null, null);
                            doc.line(110, espacio1 + 31, 200, espacio1 + 31);
                            doc.text(marker.c_observacion.toString(), 135, espacio1 + 24.65, null, null);


                            // Generador Fotovoltaico Instalado
                            espacio += 18;
                            doc.setFontStyle('bold');
                            doc.text('GENERADOR FOTOVOLTAICO INSTALADO ', 111, espacio + 23.5, null, null, 'center');

                            let equipo1 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Panel Fotovoltaico');
                            let medicion_equipo1_1 = this.equipos.find(x => x.c_equipo == 'Panel Fotovoltaico' && x.c_atributo == 'Tensión Nominal');
                            let medicion_equipo1_2 = this.equipos.find(x => x.c_equipo == 'Panel Fotovoltaico' && x.c_atributo == 'Potencia');
                            let medicion_equipo1_3 = this.equipos.find(x => x.c_equipo == 'Panel Fotovoltaico' && x.c_atributo == 'Coriente Icc');
                            let medicion_equipo1_4 = this.equipos.find(x => x.c_equipo == 'Panel Fotovoltaico' && x.c_atributo == 'Coriente Icc');


                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 65); // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 65) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 45) // vertical line
                            doc.line(105, espacio + 25, 105, espacio + 45) // vertical line
                            doc.line(110, espacio + 25, 110, espacio + 45) // vertical line
                            doc.line(155, espacio + 25, 155, espacio + 45) // vertical line
                            espacio -= 3;
                            doc.text('Marca', 16, espacio + 31.5, null, null);
                            doc.text(equipo1 != null ? equipo1.c_marca : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('N° SERIE', 115, espacio + 31.5, null, null);
                            doc.text(equipo1 != null ? equipo1.c_serie : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Procedencia', 16, espacio + 31.5, null, null);
                            doc.text(equipo1 != null ? equipo1.c_procedencia : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('AÑO DE FABRICACIÓN', 115, espacio + 31.5, null, null);
                            doc.text(equipo1 != null ? equipo1.n_annio.toString() : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Modelo', 16, espacio + 31.5, null, null);
                            doc.text(equipo1 != null ? equipo1.c_modelo : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('TIPO', 115, espacio + 31.5, null, null);
                            doc.text(equipo1 != null ? equipo1.c_tipo : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Tensión Nominal(V)', 16, espacio + 31.5, null, null);
                            doc.text(medicion_equipo1_1 != null ? medicion_equipo1_1.c_valor : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('POTENCIA(Wp)', 115, espacio + 31.5, null, null);
                            doc.text(medicion_equipo1_2 != null ? medicion_equipo1_2.c_valor : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación: ', 16, espacio + 31.5, null, null);
                            doc.text(equipo1 != null ? equipo1.c_observacion : '', 35, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.setFontStyle('bold');
                            doc.text('MEDICIÓN DE GENERADOR FOTOVOLTAICO - PANEL', 111, espacio + 31.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('¿Está operativo el Generador Fotovoltaico(Panel)?', 16, espacio + 31.5, null, null);
                            doc.line(110, espacio + 27.9, 110, espacio + 33) // vertical line
                            doc.line(132, espacio + 27.9, 132, espacio + 33) // vertical line
                            doc.line(154, espacio + 27.9, 154, espacio + 33) // vertical line
                            doc.line(157, espacio + 27.9, 157, espacio + 33) // vertical line
                            doc.line(178, espacio + 27.9, 178, espacio + 33) // vertical line
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            doc.text('SI', 121, espacio + 31.5, null, null, 'center');
                            doc.text(equipo1 != null ? (equipo1.b_operativo == 1 ? 'X' : '') : '', 143.5, espacio + 31.5, null, null, 'center');
                            doc.text('NO', 168, espacio + 31.5, null, null, 'center');
                            doc.text(equipo1 != null ? (equipo1.b_operativo != 1 ? 'X' : '') : '', 189, espacio + 31.5, null, null, 'center');

                            doc.line(55, espacio + 33, 55, espacio + 38) // vertical line
                            doc.line(105, espacio + 33, 105, espacio + 38) // vertical line
                            doc.line(110, espacio + 33, 110, espacio + 38) // vertical line
                            doc.line(155, espacio + 33, 155, espacio + 38) // vertical line
                            espacio += 5;
                            doc.text('Tensión(Vdc)', 16, espacio + 31.5, null, null);
                            doc.text('-', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Corriente(Icc)', 115, espacio + 31.5, null, null);
                            doc.text(medicion_equipo1_3 != null ? medicion_equipo1_3.c_valor : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            // Unidad de almacenamiento instalado

                            let equipo2 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Batería');
                            let medicion_equipo2_1 = this.equipos.find(x => x.c_equipo == 'Batería' && x.c_atributo == 'Tensión Nominal');
                            let medicion_equipo2_2 = this.equipos.find(x => x.c_equipo == 'Batería' && x.c_atributo == 'Tensión Vacio');
                            let medicion_equipo2_3 = this.equipos.find(x => x.c_equipo == 'Batería' && x.c_atributo == 'Tensión Carga');
                            let medicion_equipo2_4 = this.equipos.find(x => x.c_equipo == 'Batería' && x.c_atributo == 'Cantidad');

                            espacio += 25;
                            doc.setFontStyle('bold');
                            doc.text('UNIDAD DE ALMACENAMIENTO INSTALADO(BATERÍA)', 111, espacio + 23.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 65) // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 65) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 45) // vertical line
                            doc.line(105, espacio + 25, 105, espacio + 45) // vertical line
                            doc.line(110, espacio + 25, 110, espacio + 45) // vertical line
                            doc.line(155, espacio + 25, 155, espacio + 45) // vertical line
                            espacio -= 3;
                            doc.text('Marca', 16, espacio + 31.5, null, null);
                            doc.text(equipo2 != null ? equipo2.c_marca : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('N° SERIE', 115, espacio + 31.5, null, null);
                            doc.text(equipo2 != null ? equipo2.c_serie : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Procedencia', 16, espacio + 31.5, null, null);
                            doc.text(equipo2 != null ? equipo2.c_procedencia : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('AÑO DE FABRICACIÓN', 115, espacio + 31.5, null, null);
                            doc.text(equipo2 != null ? equipo2.n_annio.toString() : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Modelo', 16, espacio + 31.5, null, null);
                            doc.text(equipo2 != null ? equipo2.c_modelo : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('TIPO', 115, espacio + 31.5, null, null);
                            doc.text(equipo2 != null ? equipo2.c_tipo : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Tensión Nominal(V)', 16, espacio + 31.5, null, null);
                            doc.text(medicion_equipo2_1 != null ? medicion_equipo2_1.c_valor : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Capacidad(Ah)', 115, espacio + 31.5, null, null);
                            doc.text(medicion_equipo2_4 != null ? medicion_equipo2_4.c_valor : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación: ', 16, espacio + 31.5, null, null);
                            doc.text(equipo2 != null ? equipo2.c_observacion : '', 35, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.setFontStyle('bold');
                            doc.text('MEDICIÓN DE PARÁMETROS EN LA BATERÍA', 111, espacio + 31.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('¿Está operativo el acumulador de energía(Batería)?', 16, espacio + 31.5, null, null);
                            doc.line(110, espacio + 27.9, 110, espacio + 33) // vertical line
                            doc.line(132, espacio + 27.9, 132, espacio + 33) // vertical line
                            doc.line(154, espacio + 27.9, 154, espacio + 33) // vertical line
                            doc.line(157, espacio + 27.9, 157, espacio + 33) // vertical line
                            doc.line(178, espacio + 27.9, 178, espacio + 33) // vertical line
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            doc.text('SI', 121, espacio + 31.5, null, null, 'center');
                            doc.text(equipo2 != null ? (equipo2.b_operativo == 1 ? 'X' : '') : '', 143.5, espacio + 31.5, null, null, 'center');
                            doc.text('NO', 168, espacio + 31.5, null, null, 'center');
                            doc.text(equipo2 != null ? (equipo2.b_operativo != 1 ? 'X' : '') : '', 189, espacio + 31.5, null, null, 'center');

                            doc.line(55, espacio + 33, 55, espacio + 38) // vertical line
                            doc.line(105, espacio + 33, 105, espacio + 38) // vertical line
                            doc.line(110, espacio + 33, 110, espacio + 38) // vertical line
                            doc.line(155, espacio + 33, 155, espacio + 38) // vertical line
                            espacio += 5;
                            doc.text('Tensión en vacio (V)', 16, espacio + 31.5, null, null);
                            doc.text(medicion_equipo2_2 != null ? medicion_equipo2_2.c_valor : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Tensión con carga (V)', 115, espacio + 31.5, null, null);
                            doc.text(medicion_equipo2_3 != null ? medicion_equipo2_3.c_valor : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            // CONTROLADOR INSTALADO
                            let equipo3 = this.equipos.find(x => x.n_fila == 1 && x.c_equipo == 'Controlador de Carga');
                            let medicion_equipo3_1 = this.equipos.find(x => x.c_equipo == 'Controlador de Carga' && x.c_atributo == 'Tensión Nominal');
                            let medicion_equipo3_2 = this.equipos.find(x => x.c_equipo == 'Controlador de Carga' && x.c_atributo == 'Corriente A');
                            let medicion_equipo3_3 = this.equipos.find(x => x.c_equipo == 'Controlador de Carga' && x.c_atributo == 'Capacidad Ingreso');
                            let medicion_equipo3_4 = this.equipos.find(x => x.c_equipo == 'Controlador de Carga' && x.c_atributo == 'Tensión Bateria');
                            let medicion_equipo3_5 = this.equipos.find(x => x.c_equipo == 'Controlador de Carga' && x.c_atributo == 'Capacidad Salida');

                            espacio += 25;
                            doc.setFontStyle('bold');
                            doc.text('CONTROLADOR INSTALADO', 111, espacio + 23.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 65) // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 65) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 45) // vertical line
                            doc.line(105, espacio + 25, 105, espacio + 45) // vertical line
                            doc.line(110, espacio + 25, 110, espacio + 45) // vertical line
                            doc.line(155, espacio + 25, 155, espacio + 45) // vertical line
                            espacio -= 3
                            doc.text('Marca', 16, espacio + 31.5, null, null);
                            doc.text(equipo3 != null ? equipo3.c_marca : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('N° SERIE', 115, espacio + 31.5, null, null);
                            doc.text(equipo3 != null ? equipo3.c_serie : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Procedencia', 16, espacio + 31.5, null, null);
                            doc.text(equipo3 != null ? equipo3.c_procedencia : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('AÑO DE FABRICACIÓN', 115, espacio + 31.5, null, null);
                            doc.text(equipo3 != null ? equipo3.n_annio.toString() : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Modelo', 16, espacio + 31.5, null, null);
                            doc.text(equipo3 != null ? equipo3.c_modelo : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('TIPO', 115, espacio + 31.5, null, null);
                            doc.text(equipo3 != null ? equipo3.c_tipo : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Tensión Nominal(V)', 16, espacio + 31.5, null, null);
                            doc.text(medicion_equipo3_1 != null ? medicion_equipo3_1.c_valor : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Corriente (Amp)', 115, espacio + 31.5, null, null);
                            doc.text(medicion_equipo3_2 != null ? medicion_equipo3_2.c_valor : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación: ', 16, espacio + 31.5, null, null);
                            doc.text(equipo3 != null ? equipo3.c_observacion : '', 35, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.setFontStyle('bold');
                            doc.text('MEDICIÓN DE PARÁMETROS EN EL CONTROLADOR', 111, espacio + 31.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('¿Está operativo el (Batería)?', 16, espacio + 31.5, null, null);
                            doc.line(110, espacio + 27.9, 110, espacio + 33) // vertical line
                            doc.line(132, espacio + 27.9, 132, espacio + 33) // vertical line
                            doc.line(154, espacio + 27.9, 154, espacio + 33) // vertical line
                            doc.line(157, espacio + 27.9, 157, espacio + 33) // vertical line
                            doc.line(178, espacio + 27.9, 178, espacio + 33) // vertical line
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            doc.text('SI', 121, espacio + 31.5, null, null, 'center');
                            doc.text(equipo3 != null ? (equipo3.b_operativo == 1 ? 'X' : '') : '', 143.5, espacio + 31.5, null, null, 'center');
                            doc.text('NO', 168, espacio + 31.5, null, null, 'center');
                            doc.text(equipo3 != null ? (equipo3.b_operativo != 1 ? 'X' : '') : '', 189, espacio + 31.5, null, null, 'center');

                            doc.line(57, espacio + 33, 57, espacio + 38) // vertical line
                            doc.line(80, espacio + 33, 80, espacio + 38) // vertical line
                            doc.line(115, espacio + 33, 115, espacio + 38) // vertical line
                            doc.line(138, espacio + 33, 138, espacio + 38) // vertical line
                            doc.line(180, espacio + 33, 180, espacio + 38) // vertical line
                            espacio += 5;
                            doc.text('Tensión en la entrada del panel:', 12, espacio + 31.5, null, null);
                            doc.text(medicion_equipo3_3 != null ? medicion_equipo3_3.c_valor : '', 69, espacio + 31.5, null, null, 'center');
                            doc.text('Tensión en la salida:', 81, espacio + 31.5, null, null);
                            doc.text(medicion_equipo3_5 != null ? medicion_equipo3_5.c_valor : '', 125, espacio + 31.5, null, null, 'center');
                            doc.text('Tensión en la batería:', 140, espacio + 31.5, null, null);
                            doc.text(medicion_equipo3_4 != null ? medicion_equipo3_4.c_valor : '', 190, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            //--------------------------------add page
                            doc.addPage();
                            doc.setFontSize(10);

                            var espacio = 2;

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
                            doc.setFontSize(10);
                            doc.setFontStyle('Bold');
                            doc.setFontStyle('Calibri Light');


                            // DATOS DE LÁMPARAS -REGISTRADOS
                            let lampara1 = this.lamparas.find(x => x.n_fila == 1);
                            let lampara2 = this.lamparas.find(x => x.n_fila == 2);
                            let lampara3 = this.lamparas.find(x => x.n_fila == 3);


                            doc.setLineWidth(0);
                            espacio += 5;
                            doc.setFontStyle('bold');
                            doc.text('DATOS DE LÁMPARAS - REGISTRADAS', 111, espacio + 23.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 60) // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 60) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 45) // vertical line
                            doc.line(95, espacio + 25, 95, espacio + 45) // vertical line
                            doc.line(130, espacio + 25, 130, espacio + 45) // vertical line
                            doc.line(165, espacio + 25, 165, espacio + 45) // vertical line

                            espacio -= 3;
                            doc.text('Marca', 33, espacio + 31.5, null, null, 'center');
                            doc.text('Serie', 75, espacio + 31.5, null, null, 'center');
                            doc.text('Potencia(W).', 113, espacio + 31.5, null, null, 'center');
                            doc.text('TIPO', 148, espacio + 31.5, null, null, 'center');
                            doc.text('ESTADO', 183, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('L. N° 1:', 12, espacio + 31.5, null, null);
                            doc.text(lampara1 != null ? lampara1.c_marca : '', 25, espacio + 31.5, null, null);
                            doc.text(lampara1 != null ? lampara1.c_serie : '', 75, espacio + 31.5, null, null, 'center');
                            doc.text(lampara1 != null ? lampara1.n_potencia : '', 113, espacio + 31.5, null, null, 'center');
                            doc.text(lampara1 != null ? lampara1.c_tipo : '', 148, espacio + 31.5, null, null, 'center');
                            doc.text(lampara1 != null ? (lampara1.b_operativo == 1 ? 'OPERATIVO' : 'INOPERATIVO') : '', 183, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('L. N° 2:', 12, espacio + 31.5, null, null);
                            doc.text(lampara2 != null ? lampara2.c_marca : '', 25, espacio + 31.5, null, null);
                            doc.text(lampara2 != null ? lampara2.c_serie : '', 75, espacio + 31.5, null, null, 'center');
                            doc.text(lampara2 != null ? lampara2.n_potencia.toString() : '', 113, espacio + 31.5, null, null, 'center');
                            doc.text(lampara2 != null ? lampara2.c_tipo : '', 148, espacio + 31.5, null, null, 'center');
                            doc.text(lampara2 != null ? (lampara2.b_operativo == 1 ? 'OPERATIVO' : 'INOPERATIVO') : '', 183, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('L. N° 3:', 12, espacio + 31.5, null, null);
                            doc.text(lampara3 != null ? lampara3.c_marca : '', 25, espacio + 31.5, null, null);
                            doc.text(lampara3 != null ? lampara3.c_serie : '', 75, espacio + 31.5, null, null, 'center');
                            doc.text(lampara3 != null ? lampara3.n_potencia.toString() : '', 113, espacio + 31.5, null, null, 'center');
                            doc.text(lampara3 != null ? lampara3.c_tipo : '', 148, espacio + 31.5, null, null, 'center');
                            doc.text(lampara3 != null ? (lampara3.b_operativo == 1 ? 'OPERATIVO' : 'INOPERATIVO') : '', 183, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación L. N° 1:', 12, espacio + 31.5, null, null);
                            doc.text(lampara1 != null ? lampara1.c_observacion : '', 43, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación L. N° 2:', 12, espacio + 31.5, null, null);
                            doc.text(lampara2 != null ? lampara2.c_observacion : '', 43, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación L. N° 3:', 12, espacio + 31.5, null, null);
                            doc.text(lampara3 != null ? lampara3.c_observacion : '', 43, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            // CABLE PANEL - CONTROLADOR
                            let componente1 = this.componentes.find(x => x.n_fila == 1 && x.c_equipo == 'Cable Panel-Controlador');
                            let componente2 = this.componentes.find(x => x.n_fila == 1 && x.c_equipo == 'Cable Controlador-Bateria');
                            let componente3 = this.componentes.find(x => x.n_fila == 1 && x.c_equipo == 'Cable Controlador-Termomagnetico');
                            let componente4 = this.componentes.find(x => x.n_fila == 1 && x.c_equipo == 'Cable Termomagnetico-DI');

                            espacio += 20;
                            doc.setFontStyle('bold');
                            doc.text('CABLE CONTROLADOR - CONTROLADOR', 111, espacio + 23.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 40) // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 40) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 35) // vertical line
                            doc.line(105, espacio + 25, 105, espacio + 35) // vertical line
                            doc.line(110, espacio + 25, 110, espacio + 35) // vertical line
                            doc.line(155, espacio + 25, 155, espacio + 35) // vertical line
                            espacio -= 3
                            doc.text('Marca', 16, espacio + 31.5, null, null);
                            doc.text(componente1 != null ? componente1.c_marca : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Procedencia', 115, espacio + 31.5, null, null);
                            doc.text(componente1 != null ? componente1.c_procedencia : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Calibre mm²', 16, espacio + 31.5, null, null);
                            doc.text(componente1 != null ? componente1.c_modelo : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Tipo', 115, espacio + 31.5, null, null);
                            doc.text(componente1 != null ? componente1.c_tipo : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación: ', 16, espacio + 31.5, null, null);
                            doc.text(componente1 != null ? componente1.c_observacion : '', 35, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            // CABLE CONTROLADOR - BATERÍA
                            espacio += 20;
                            doc.setFontStyle('bold');
                            doc.text('CABLE CONTROLADOR - BATERÍA', 111, espacio + 23.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 40) // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 40) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 35) // vertical line
                            doc.line(105, espacio + 25, 105, espacio + 35) // vertical line
                            doc.line(110, espacio + 25, 110, espacio + 35) // vertical line
                            doc.line(155, espacio + 25, 155, espacio + 35) // vertical line
                            espacio -= 3
                            doc.text('Marca', 16, espacio + 31.5, null, null);
                            doc.text(componente2 != null ? componente2.c_marca : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Procedencia', 115, espacio + 31.5, null, null);
                            doc.text(componente2 != null ? componente2.c_procedencia : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Calibre mm²', 16, espacio + 31.5, null, null);
                            doc.text(componente2 != null ? componente2.c_modelo : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Tipo', 115, espacio + 31.5, null, null);
                            doc.text(componente2 != null ? componente2.c_tipo : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación: ', 16, espacio + 31.5, null, null);
                            doc.text(componente2 != null ? componente2.c_observacion : '', 35, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            // CABLE CONTROLADOR - ITM
                            espacio += 20;
                            doc.setFontStyle('bold');
                            doc.text('CABLE CONTROLADOR - ITM', 111, espacio + 23.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 40) // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 40) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 35) // vertical line
                            doc.line(105, espacio + 25, 105, espacio + 35) // vertical line
                            doc.line(110, espacio + 25, 110, espacio + 35) // vertical line
                            doc.line(155, espacio + 25, 155, espacio + 35) // vertical line
                            espacio -= 3
                            doc.text('Marca', 16, espacio + 31.5, null, null);
                            doc.text(componente3 != null ? componente3.c_marca : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Procedencia', 115, espacio + 31.5, null, null);
                            doc.text(componente3 != null ? componente3.c_procedencia : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Calibre mm²', 16, espacio + 31.5, null, null);
                            doc.text(componente3 != null ? componente3.c_modelo : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Tipo', 115, espacio + 31.5, null, null);
                            doc.text(componente3 != null ? componente3.c_tipo : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación: ', 16, espacio + 31.5, null, null);
                            doc.text(componente3 != null ? componente3.c_observacion : '', 35, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            // CABLE INSTALACIONES INTERNAS
                            espacio += 20;
                            doc.setFontStyle('bold');
                            doc.text('CABLE INSTALACIONES INTERNAS', 111, espacio + 23.5, null, null, 'center');
                            doc.setFontStyle('normal');
                            doc.line(11, espacio + 25, 200, espacio + 25);
                            doc.line(11, espacio + 20, 200, espacio + 20);
                            doc.line(11, espacio + 20, 11, espacio + 40) // vertical line
                            doc.line(200, espacio + 20, 200, espacio + 40) // vertical line
                            doc.line(55, espacio + 25, 55, espacio + 35) // vertical line
                            doc.line(105, espacio + 25, 105, espacio + 35) // vertical line
                            doc.line(110, espacio + 25, 110, espacio + 35) // vertical line
                            doc.line(155, espacio + 25, 155, espacio + 35) // vertical line
                            espacio -= 3
                            doc.text('Marca', 16, espacio + 31.5, null, null);
                            doc.text(componente4 != null ? componente4.c_marca : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Procedencia', 115, espacio + 31.5, null, null);
                            doc.text(componente4 != null ? componente4.c_procedencia : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Calibre mm²', 16, espacio + 31.5, null, null);
                            doc.text(componente4 != null ? componente4.c_modelo : '', 80, espacio + 31.5, null, null, 'center');
                            doc.text('Tipo', 115, espacio + 31.5, null, null);
                            doc.text(componente4 != null ? componente4.c_tipo : '', 178, espacio + 31.5, null, null, 'center');
                            doc.line(11, espacio + 33, 200, espacio + 33);

                            espacio += 5;
                            doc.text('Observación: ', 16, espacio + 31.5, null, null);
                            doc.text(componente4 != null ? componente4.c_observacion : '', 35, espacio + 31.5, null, null);
                            doc.line(11, espacio + 33, 200, espacio + 33);


                            // Firmas
                            espacio = 245;
                            doc.line(15, espacio + 16, 70, espacio + 16);
                            doc.line(77, espacio + 16, 133, espacio + 16);
                            doc.line(140, espacio + 16, 196, espacio + 16);

                            doc.setFontStyle('bold');
                            doc.text('USUARIO:', 15, espacio - 5, null, null);
                            let foto11 = this.detalles.find(x => x.n_fila == 11);
                            if (foto11 != null) {
                              var img = new Image()
                              img.src = foto11.c_nombrefoto;
                              doc.addImage(img, 'JPEG', 18, espacio - 3, 50, 18);
                            }
                            //var imgData = ''
                            //doc.addImage(imgData, 'JPEG', 18, espacio-3, 50, 18)

                            doc.text('SUPERVISOR:', 77, espacio - 5, null, null);
                            /*let foto13 = this.detalles.find(x => x.n_fila == 13);
                            if(foto13!=null){
                              var img = new Image()
                              img.src = foto13.c_nombrefoto;
                              doc.addImage(img, 'JPEG', 80, espacio-3, 50, 18);
                            }*/
                            //var imgData = ''
                            //doc.addImage(imgData, 'JPEG', 80, espacio-3, 50, 18)

                            doc.text('TECNICO:', 140, espacio - 5, null, null);
                            let foto12 = this.detalles.find(x => x.n_fila == 12);
                            if (foto12 != null) {
                              var img = new Image()
                              img.src = foto12.c_nombrefoto;
                              doc.addImage(img, 'JPEG', 143, espacio - 3, 50, 18);
                            }
                            //var imgData = ''
                            //doc.addImage(imgData, 'JPEG', 143, espacio-3, 50, 18)
                            doc.setFontStyle('normal');
                            espacio -= 0;
                            doc.text('Nombre:', 15, espacio + 20.5);
                            doc.setFontSize(7);
                            doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 30, espacio + 20.5);
                            doc.setFontSize(7.5);
                            doc.text('Nombre:', 77, espacio + 20.5);
                            doc.text('', 92, espacio + 20.5);
                            doc.text('Nombre:', 140, espacio + 20.5);
                            doc.text(marker.c_tecnico, 155, espacio + 20.5);

                            espacio += 5;
                            doc.text('DNI:', 15, espacio + 20.5);
                            doc.text(marker.c_dni, 30, espacio + 20.5);
                            doc.text('DNI:', 77, espacio + 20.5);
                            doc.text('', 92, espacio + 20.5);
                            doc.text('DNI:', 140, espacio + 20.5);
                            doc.text(marker.c_dnitecnico, 155, espacio + 20.5);

                            espacio += 5;
                            doc.text('Parentesco:', 15, espacio + 20.5);
                            doc.text('', 30, espacio + 20.5);

                            //----------------------------------------------- other page

                            doc.addPage();
                            doc.setFontSize(10);

                            var espacio = 2;

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
                            doc.setFontSize(10);
                            doc.setFontStyle('bold');
                            doc.text('SUMINISTRO: ', 11, espacio + 22.5, null, null);
                            doc.text(marker.c_codigo, 40, espacio + 22.5, null, null);
                            doc.setFontStyle('Bold');
                            doc.setFontStyle('Calibri Light');

                            // FOTOS
                            espacio += 10;

                            let foto1 = this.detalles.find(x => x.n_fila == 1);
                            if (foto1 != null) {
                              doc.text(foto1.c_tipo, 15, espacio + 20);
                              var img = new Image();
                              img.src = foto1.c_nombrefoto;
                              doc.addImage(img, "JPEG", 15, espacio + 25, 50, 50);
                            }

                            let foto2 = this.detalles.find(x => x.n_fila == 2);
                            if (foto2 != null) {
                              doc.text(foto2.c_tipo, 75, espacio + 20);
                              var img = new Image()
                              img.src = foto2.c_nombrefoto;
                              doc.addImage(img, "JPEG", 75, espacio + 25, 50, 50);
                            }

                            let foto3 = this.detalles.find(x => x.n_fila == 3);
                            if (foto3 != null) {
                              doc.text(foto3.c_tipo, 135, espacio + 20);
                              var img = new Image()
                              img.src = foto3.c_nombrefoto;
                              doc.addImage(img, "JPEG", 135, espacio + 25, 50, 50);
                            }

                            let foto4 = this.detalles.find(x => x.n_fila == 4);
                            if (foto4 != null) {
                              doc.text(foto4.c_tipo, 15, espacio + 80);
                              var img = new Image()
                              img.src = foto4.c_nombrefoto;
                              doc.addImage(img, "JPEG", 15, espacio + 85, 50, 50);
                            }

                            let foto5 = this.detalles.find(x => x.n_fila == 5);
                            if (foto5 != null) {
                              doc.text(foto5.c_tipo, 75, espacio + 80);
                              var img = new Image()
                              img.src = foto5.c_nombrefoto;
                              doc.addImage(img, "JPEG", 75, espacio + 85, 50, 50);
                            }

                            let foto6 = this.detalles.find(x => x.n_fila == 6);
                            if (foto6 != null) {
                              doc.text(foto6.c_tipo, 135, espacio + 80);
                              var img = new Image()
                              img.src = foto6.c_nombrefoto;
                              doc.addImage(img, "JPEG", 135, espacio + 85, 50, 50);
                            }

                            let foto7 = this.detalles.find(x => x.n_fila == 7);
                            if (foto7 != null) {
                              doc.text(foto7.c_tipo, 15, espacio + 140);
                              var img = new Image()
                              img.src = foto7.c_nombrefoto;
                              doc.addImage(img, "JPEG", 15, espacio + 145, 50, 50);
                            }

                            let foto8 = this.detalles.find(x => x.n_fila == 8);
                            if (foto8 != null) {
                              doc.text(foto8.c_tipo, 75, espacio + 140);
                              var img = new Image()
                              img.src = foto8.c_nombrefoto;
                              doc.addImage(img, "JPEG", 75, espacio + 145, 50, 50);
                            }

                            let foto9 = this.detalles.find(x => x.n_fila == 9);
                            if (foto9 != null) {
                              doc.text(foto9.c_tipo, 135, espacio + 140);
                              var img = new Image()
                              img.src = foto9.c_nombrefoto;
                              doc.addImage(img, "JPEG", 135, espacio + 145, 50, 50);
                            }

                            let foto10 = this.detalles.find(x => x.n_fila == 10);
                            if (foto10 != null) {
                              doc.text(foto10.c_tipo, 15, espacio + 200);
                              var img = new Image()
                              img.src = foto10.c_nombrefoto;
                              doc.addImage(img, "JPEG", 15, espacio + 205, 50, 50);
                            }


                            let nombrePDF = 'Acta_Inspección_' + marker.c_codigo + '.pdf';
                            doc.save(nombrePDF);

                          }
                        }, error => {
                          try {
                            this.openSnackBar(error.error.Detail, error.error.StatusCode);
                          } catch (error) {
                            this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
                          }
                        });
                    }
                  }, error => {
                    try {
                      this.openSnackBar(error.error.Detail, error.error.StatusCode);
                    } catch (error) {
                      this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
                    }
                  });
              }
            }, error => {
              try {
                this.openSnackBar(error.error.Detail, error.error.StatusCode);
              } catch (error) {
                this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
              }
            });
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
