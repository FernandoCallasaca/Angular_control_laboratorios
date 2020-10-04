import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import {
  MatPaginator,
  MatTableDataSource,
  MatSort
} from '@angular/material';
import {
  MapaService
} from '../../../service/mapa.services';
import {
  AppSettings
} from '../../../common/appsettings'
import {
  Router
} from '@angular/router';
import {
  MatDialog
} from '@angular/material';
import {
  MatSnackBar
} from '@angular/material';
import {
  BaseComponent
} from '../../base/base.component';

// Genarl services
import {
  GeneralService
} from '../../../service/general.service';
import {
  SeguridadService
} from '../../../service/seguridad.service';

import {
  ResultadoApi
} from '../../../interface/common.interface';

import {
  ExcelService
} from '../../../service/excel.service';

import * as JsPDF from 'jspdf';

@Component({
  selector: 'app-mapareclamos',
  templateUrl: './mapareclamos.component.html',
  styleUrls: ['./mapareclamos.component.css'],
  providers: [SeguridadService, MapaService, GeneralService, ExcelService]
})
export class MapareclamosComponent extends BaseComponent implements OnInit {
  panelesAcordion = [1, 2, 3, 4];
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
  reclamos = [];
  motivosreclamos = [];
  respuestas = [];
  lamparas = [];
  equipos = [];
  componentes = [];
  // Agregamos periodo
  periodos = [];
  // Agregamos Usuario
  usuarios = []

  @Input() iddepartamento: number = 0;
  @Input() idprovincia: number = 0;
  @Input() iddistrito: number = 0;
  @Input() idcentropoblado: number = 0;
  @Input() identidad: number = 0;
  // Inicializamos el periodo
  @Input() idperiodo: number = 0;
  @Input() idusuario: number = 0;
  @Input() dateinicio;
  @Input() datefin;

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
    this.getDepartamento();
    this.getReclamo();
    this.getEntidad();
  }

  getTablaDetalle(data) {
    console.log(data);
    this.tablaDetalle = new MatTableDataSource < any > (data);
    this.tablaDetalle.sort = this.sortDetalle;
    this.tablaDetalle.paginator = this.paginatorDetalle;
  }

  getReclamo() {
    let req = {
      n_idgen_departamento: this.iddepartamento,
      n_idgen_provincia: this.idprovincia,
      n_idgen_distrito: this.iddistrito,
      n_idgen_centropoblado: this.idcentropoblado,
      n_idgen_entidad: this.identidad,
      n_idseg_user: this.idusuario,
      dateinicio: this.dateinicio,
      datefin: this.datefin
    }
    //console.log(req.toString());

    this._mapa_service.getReclamo(req, this.getToken().token).subscribe(
      result => {

        let resultado = < ResultadoApi > result;
        if (resultado.estado) {
          this.markers = [];
          this.puntos = resultado.data;
          result.data.forEach(element => {
            console.log(element)
            console.log("marker aquí")
            let marker = {
              lat: element.c_latitud,
              lng: element.c_longitud,
              label: 'A',
              alpha: 1,
              data: element,
              url: './assets/map/icono-deppol.svg'
            };
            console.log(marker);
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
      n_idseg_user: this.idusuario,
      dateinicio: this.dateinicio,
      datefin: this.datefin
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
  getReclamosGrilla(idencuesta) {
    let req = {
      n_idgen_sistemafotovoltaico: idencuesta
    }
    this._mapa_service.getReclamosGrilla(req, this.getToken().token).subscribe(
      result => {
        console.log('resultado grilla de reclamos');
        console.log(result);
        let resultado = < ResultadoApi > result;
        if (resultado.estado) {

          this.reclamos = resultado.data;
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
      n_idrec_reclamo: idencuesta
    }
    this._mapa_service.getDetalleReclamo(req, this.getToken().token).subscribe(
      result => {
        console.log('resultado detalle');
        console.log(result);
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

  getMotivoReclamo(idencuesta) {
    let req = {
      n_idrec_reclamo: idencuesta
    }
    this._mapa_service.getMotivosReclamos(req, this.getToken().token).subscribe(
      result => {
        console.log('resultado motivo reclamo');
        console.log(result);
        let resultado = < ResultadoApi > result;
        if (resultado.estado) {

          this.motivosreclamos = resultado.data;
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

  selectusuario(n_idseg_user) {
    this.idusuario = n_idseg_user;
    //this.getTablaUsuarioubigeo();
  }

  clicked(marker) {
    //this.getDetalle(marker.data.n_idrec_reclamo);
    this.getReclamosGrilla(marker.data.n_idgen_sistemafotovoltaico);
    //this.getDetalle(36);
    console.log(marker.data.n_idgen_sistemafotovoltaico);
  }
  clickedAcordionReclamo(n_idrec_reclamo){
    console.log('Entro a fotoreclamo');
    this.getDetalle(n_idrec_reclamo);
    this.getMotivoReclamo(n_idrec_reclamo);
  }
  export () {
    this.getxls();
  }

  downloadReclamo(marker) {
    console.log('marker: ');
    console.log(marker);
    let doc = new JsPDF();

    let specialElementHandlers = {
      '#editor': function (element, render) {
        return true;
      }
    };



    var img = new Image()
    img.src = '../../../../assets/images/logo_adinelsa.jpg';
    var espacio = 2
    doc.addImage(img, 'JPEG', 12, espacio + 5, 45, 9.8);

    doc.setFontStyle('Arial Narrow');
    doc.setFontSize(10); // Tamaño de la fuente
    doc.text('  EMPRESA DE ADMINISTRACIÓN DE', 138, espacio + 7, null, null); //(TEXTO ,inicio margen derecho,altura superior,,)
    doc.text('INFRAESTRUCTURA ELECTRICA S.A.', 138, espacio + 12, null, null);
    doc.setLineWidth(0.5);

    var espacio = 2

    doc.setFontStyle("Arial Narrow");
    doc.setFontSize(10); // Tamaño de la fuente
    doc.text("  EMPRESA DE ADMINISTRACIÓN DE", 138, espacio + 7, null, null); //(TEXTO ,inicio margen derecho,altura superior,,)
    doc.text("INFRAESTRUCTURA ELECTRICA S.A.", 138, espacio + 12, null, null);
    doc.setLineWidth(0.5);
    doc.line(11, espacio + 16, 200, espacio + 16); //(margen izquierda, margen superior inicial, tamaño largo, margen superior final)
    doc.setFontSize(14);
    doc.setFontStyle("bold");
    doc.text("SOLICITUD DE RECLAMO DEL SFVD", 105, espacio + 26, null, null, "center");
    doc.setFontStyle("Calibri");

    doc.setFontSize(11);
    doc.setFontStyle("bold");
    doc.text("SUMINISTRO N°:", 11, espacio + 37, null, null);
    doc.text(marker.c_codigo, 50, espacio + 36.3, null, null);
    doc.setLineWidth(0.1)
    doc.line(50, espacio + 37, 90, espacio + 37); // horizontal line
    doc.text("Fecha:", 170, espacio + 37, null, null);
    doc.text(marker.c_fecha, 182, espacio + 37, null, null);
    doc.setLineWidth(0.1)

    doc.setFontStyle('Calibri');
    espacio += 10;
    doc.text("Yo:", 11, espacio + 37, null, null);
    doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 20, espacio + 36.5, null, null);
    doc.line(20, espacio + 37, 160, espacio + 37) // horizontal line

    espacio += 10;
    doc.text("DNI N°:", 11, espacio + 37, null, null);
    doc.text(marker.c_dni, 25, espacio + 36.5, null, null);
    doc.line(25, espacio + 37, 90, espacio + 37) // horizontal line

    espacio += 10;
    doc.text("Por el presente documento,", 11, espacio + 37, null, null);
    doc.setFontStyle('bold');
    doc.text("SOLICITO EL RECLAMO", 55, espacio + 37, null, null);
    doc.setFontStyle('Calibri');
    doc.text("del Sistema Fotovoltaico Domicilario, ubicado en:", 103, espacio + 37, null, null);

    espacio += 10;
    doc.text("Región", 11, espacio + 37, null, null);
    doc.text(":", 30, espacio + 37, null, null);
    doc.text(marker.c_departamento, 37, espacio + 36.5, null, null);
    doc.line(35, espacio + 37, 160, espacio + 37) // horizontal line

    espacio += 10;
    doc.text("Provincia", 11, espacio + 37, null, null);
    doc.text(":", 30, espacio + 37, null, null);
    doc.text(marker.c_provincia, 37, espacio + 36.5, null, null);
    doc.line(35, espacio + 37, 160, espacio + 37) // horizontal line

    espacio += 10;
    doc.text("Distrito", 11, espacio + 37, null, null);
    doc.text(":", 30, espacio + 37, null, null);
    doc.text(marker.c_distrito, 37, espacio + 36.5, null, null);
    doc.line(35, espacio + 37, 160, espacio + 37) // horizontal line

    espacio += 10;
    doc.text("Localidad", 11, espacio + 37, null, null);
    doc.text(":", 30, espacio + 37, null, null);
    doc.text(marker.c_centropoblado, 37, espacio + 36.5, null, null);
    doc.line(35, espacio + 37, 160, espacio + 37) // horizontal line

    espacio += 10
    doc.text("Latitud", 11, espacio + 37, null, null);
    doc.text(marker.c_latitud, 36, espacio + 36.5, null, null);
    doc.text("Longitud", 100, espacio + 37, null, null);
    doc.text(marker.c_longitud, 126, espacio + 36.5, null, null);
    doc.text(":", 28, espacio + 37, null, null);
    doc.text(":", 120, espacio + 37, null, null);
    doc.text('', 37, espacio + 36.5, null, null);
    doc.line(35, espacio + 37, 80, espacio + 37); // horizontal line
    doc.line(125, espacio + 37, 170, espacio + 37); // horizontal line

    espacio += 10;
    doc.setFontStyle("bold");
    doc.text("Motivos el porqué del Reclamo:", 11, espacio + 37, null, null);
    doc.setFontStyle("Calibri");

    espacio += 10;
    doc.text("Yo", 11, espacio + 37, null, null);
    doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 20, espacio + 36.5, null, null);
    doc.line(18, espacio + 37, 95, espacio + 37) // horizontal line
    doc.text("usuario del Sistema Fotovoltaico Domiciliario, con suministro", 96, espacio + 36.5, null, null);

    espacio += 7;
    doc.text("N°", 11, espacio + 37, null, null);
    doc.text(marker.c_codigo, 20, espacio + 36.5, null, null);
    doc.line(18, espacio + 37, 60, espacio + 37) // horizontal line
    doc.text("identificado con DNI N°", 61, espacio + 36.5, null, null);
    doc.text(marker.c_dni, 105, espacio + 36.5, null, null);
    doc.line(100, espacio + 37, 134, espacio + 37) // horizontal line
    doc.text("relizó el reclamo por falta de energía", 135, espacio + 36.5, null, null);

    espacio += 7;
    doc.text("eléctrica en mí domicilio generado por el SFVD, ante usted me presento y expongo que:", 11, espacio + 37, null, null);

    espacio += 10;
    doc.text("A la fecha no cuento con alumbrado en mi domicilio del servicio de energía prestado por la empresa ADINELSA, lo ", 11, espacio + 37, null, null);

    espacio += 7;
    doc.text("cual solicito que a la brevedad posible me atiendan dicho inconveniente, para así beneficiarme del servicio y así", 11, espacio + 37, null, null);

    espacio += 7;
    doc.text("mis respectivos pagos.", 11, espacio + 37, null, null);

    espacio += 10;
    doc.text("Sin otro particular, espero ser atendido y solucionen dicho inconveniente ya que la energía es parte de los servicios", 11, espacio + 37, null, null);

    espacio += 7;
    doc.text("básicos en mi domicilio.", 11, espacio + 37, null, null);

    // Firmas
    espacio = 245;
    doc.line(15, espacio + 16, 93, espacio + 16);
    doc.line(120, espacio + 16, 196, espacio + 16);

    doc.setFontStyle('bold');
    doc.text('USUARIO:', 15, espacio - 5, null, null);
    let foto3 = this.detalles.find(x => x.n_fila == 3);
    if (foto3 != null) {
      var img = new Image()
      img.src = foto3.c_nombrefoto;
      doc.addImage(img, 'JPEG', 28, espacio - 3, 50, 18);
    }
    
    doc.text('TECNICO:', 120, espacio - 5, null, null);
    let foto4 = this.detalles.find(x => x.n_fila == 4);
    if (foto4 != null) {
      var img = new Image();
      img.src = foto4.c_nombrefoto;
      doc.addImage(img, 'JPEG', 133, espacio - 3, 50, 18);
    }
    //var imgData = ''
    //doc.addImage(imgData, 'JPEG', 143, espacio-3, 50, 18)
    doc.setFontStyle('normal');
    doc.setFontSize(9);
    doc.text('Nombre:', 15, espacio + 20.5);
    doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 30, espacio + 20.5);
    doc.text('Nombre:', 120, espacio + 20.5);
    doc.text('', 134, espacio + 20.5);

    espacio += 5;
    doc.text('DNI:', 15, espacio + 20.5);
    doc.text(marker.c_dni, 30, espacio + 20.5);
    doc.text('DNI:', 120, espacio + 20.5);
    doc.text('', 134, espacio + 20.5);

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

    
    let nombrePDF = 'Acta_Reclamo_' + marker.c_codigo + '.pdf';
    doc.save(nombrePDF);

  }
}
