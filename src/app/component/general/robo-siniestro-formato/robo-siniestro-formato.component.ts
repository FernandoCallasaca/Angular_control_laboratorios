import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  MapaService
} from '../../../service/mapa.services';
import {
  AppSettings
} from '../../../common/appsettings';
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
  selector: 'app-robo-siniestro-formato',
  templateUrl: './robo-siniestro-formato.component.html',
  styleUrls: ['./robo-siniestro-formato.component.css'],
  providers: [SeguridadService, MapaService, GeneralService, ExcelService]
})
export class RoboSiniestroFormatoComponent extends BaseComponent implements OnInit {

  tit: String = 'FORMATO DE ROBO / SINIESTRO';

  @Input() iddepartamento: number = 0;
  @Input() idprovincia: number = 0;
  @Input() iddistrito: number = 0;
  @Input() idcentropoblado: number = 0;
  @Input() identidad: number = 0;
  @Input() idperiodo: number = 0;
  @Input() idusuario: number = 0;
  @Input() idtipoprograma: number = 0;
  @Input() idsistemafotovoltaico: number = 0;
  @Input() idmodulo: number = 4;

  @Input() n_tipo: number = 0;
  @Input() dateinicio;
  @Input() datefin;

  lat: number = -12.088898333333335;
  lng: number = -77.00707333333334;
  zoom: number = 6;
  data: any;

  //lamparasall = [];
  //componentesall = [];
  departamentos = [];
  provincias = [];
  distritos = [];
  centropoblados = [];
  entidades = [];
  puntos = [];
  dataexport = [];
  detalles = [];
  detallesAll = [];
  respuestas = [];
  respuestasall = [];
  //lamparas = [];
  equipos = [];
  equiposall = [];
  //componentes = [];
  // Agregamos periodo
  periodos = [];
  // Agregamos Usuario
  usuarios = []
  // Agregamos arrego de mantenimientos
  mantenimientos = []

  i = 1;
  cantidad = 0;



  geoJsonObject: Object;
  markers = [];

  public edited = false;

  constructor(public snackBar: MatSnackBar,
    public router: Router,
    public _mapa_service: MapaService,
    public dialog: MatDialog,
    private excelService: ExcelService,
    public _general_service: GeneralService,
    public _seguridad_service: SeguridadService, ) {
    super(snackBar, router);
  }

  ngOnInit() {}

  download() {

    let specialElementHandlers = {
      '#editor': function (element, render) {
        return true;
      }
    };

    this.edited = true;

    let req1 = {
      n_idgen_departamento: this.iddepartamento,
      n_idgen_provincia: this.idprovincia,
      n_idgen_distrito: this.iddistrito,
      n_idgen_centropoblado: this.idcentropoblado,
      n_idgen_entidad: this.identidad,
      n_idgen_periodo: this.idperiodo,
      n_idseg_user: this.idusuario,
      n_idgen_tipoprograma: this.idtipoprograma,
      n_idmnt_sistemafotovoltaico: this.idsistemafotovoltaico,
      n_tipo: this.n_tipo,
      dateinicio: this.dateinicio,
      datefin: this.datefin,
      n_modulo: this.idmodulo
    }

    console.log("Iniciando proceso de exportación...");
    console.log(req1);

    this._mapa_service.getDataFormato(req1, this.getToken().token).subscribe(
      result => {
        console.log("Paso 1...");

        let resultado1 = < ResultadoApi > result;

        if (resultado1.estado) {
          this.markers = [];
          console.log(resultado1.data);

          // listado de equipos
          let req2 = {
            n_idmnt_sistemafotovoltaico: this.idsistemafotovoltaico
          }
          this._mapa_service.getEquiposRoboSuministro(req2, this.getToken().token).subscribe(
            result3 => {

              let resultado2 = < ResultadoApi > result3;

              if (resultado2.estado) {
                this.equiposall = resultado2.data;

                console.log(this.equiposall);

                this._mapa_service.getDetalleAll(req1, this.getToken().token).subscribe(
                  result4 => {

                    let resultado4 = < ResultadoApi > result4;

                    if (resultado4.estado) {

                      this.detallesAll = resultado4.data;

                      console.log(this.detallesAll);

                      this.cantidad = resultado1.data.length;
                      this.i = 1;
                      this.descargarpdf(resultado1.data);

                    } else {
                      this.openSnackBar(resultado4.mensaje, 99);
                    }

                  }, error => {
                    try {
                      this.openSnackBar(error.error.Detail, error.error.StatusCode);
                    } catch (error) {
                      this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
                    }
                  });

              } else {
                this.openSnackBar(resultado2.mensaje, 99);
              }

            }, error => {
              try {
                this.openSnackBar(error.error.Detail, error.error.StatusCode);
              } catch (error) {
                this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
              }
            });

        } else {
          this.openSnackBar(resultado1.mensaje, 99);
        }

      }, error => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      });
  }
  descargarpdf(datosmnt) {
    var doc = new JsPDF();
    console.log("Crear reportes..." + this.i);
    let element = datosmnt[this.i - 1];
    let marker = element;
    console.log(marker);
    this.equipos = this.equiposall.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);
    this.detalles = this.detallesAll.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);
    //this.lamparas = this.lamparasall.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);
    //this.componentes = this.componentesall.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);

    console.log(this.equipos);
    console.log(this.detalles);

    var img = new Image();
    img.src = '../../../../assets/images/logo_adinelsa.jpg';
    var espacio = 2;
    doc.addImage(img, 'JPEG', 12, espacio + 5, 45, 9.8);

    doc.setFontStyle("Arial Narrow");
    doc.setFontSize(10); // Tamaño de la fuente
    doc.text("  EMPRESA DE ADMINISTRACIÓN DE", 138, espacio + 7, null, null); //(TEXTO ,inicio margen derecho,altura superior,,)
    doc.text("INFRAESTRUCTURA ELECTRICA S.A.", 138, espacio + 12, null, null);
    doc.setLineWidth(0.5);
    doc.line(11, espacio + 16, 200, espacio + 16); //(margen izquierda, margen superior inicial, tamaño largo, margen superior final)
    doc.setFontSize(14);
    doc.setFontStyle("bold");
    doc.setFontStyle("Calibri");
    doc.text("ACTA DE REPORTE DE SISTEMA SFV SINIESTRADO/ROBADO", 105, espacio + 24, null, null, "center");

    espacio -= 3
    doc.setFontSize(8);
    doc.setFontStyle("Calibri Light");
    doc.text("CLIENTE", 11, espacio + 37, null, null);
    doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 50, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.setLineWidth(0.1)
    doc.line(50, espacio + 38, 145, espacio + 38);

    espacio += 5
    doc.text("N° DE SUMINISTRO", 11, espacio + 37, null, null);
    doc.text(marker.c_codigo, 50, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.line(50, espacio + 38, 110, espacio + 38);

    doc.text("DNI", 150, espacio + 37, null, null);
    doc.text(marker.c_dni, 159, espacio + 37, null, null);
    doc.text(":", 156, espacio + 37, null, null);
    doc.line(158, espacio + 38, 190, espacio + 38);

    doc.text("CÓDIGO", 153, espacio + 28, null, null);
    doc.text(marker.n_idmnt_sistemafotovoltaico.toString(), 177, espacio + 28, null, null, "center");
    doc.line(165, espacio + 24, 165, espacio + 29) // vertical line
    doc.line(190, espacio + 24, 190, espacio + 29) // vertical line
    doc.line(165, espacio + 29, 190, espacio + 29);
    doc.line(165, espacio + 24, 190, espacio + 24);

    espacio += 5;
    doc.text("DEPARTAMENTO", 11, espacio + 37, null, null);
    doc.text(marker.c_departamento, 50, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.line(50, espacio + 38, 145, espacio + 38);

    espacio += 5;
    doc.text("PROVINCIA", 11, espacio + 37, null, null);
    doc.text(marker.c_provincia, 50, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.line(50, espacio + 38, 145, espacio + 38);

    espacio += 5;
    doc.text("DISTRITO", 11, espacio + 37, null, null);
    doc.text(marker.c_distrito, 50, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.line(50, espacio + 38, 145, espacio + 38);

    espacio += 5;
    doc.text("LOCALIDAD", 11, espacio + 37, null, null);
    doc.text(marker.c_centropoblado, 50, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.line(50, espacio + 38, 145, espacio + 38);

    doc.text("FECHA", 153, espacio + 28, null, null);
    doc.text(marker.c_fecha, 177, espacio + 28, null, null, "center");
    doc.line(165, espacio + 24, 165, espacio + 29) // vertical line
    doc.line(190, espacio + 24, 190, espacio + 29) // vertical line
    doc.line(165, espacio + 29, 190, espacio + 29);
    doc.line(165, espacio + 24, 190, espacio + 24);

    espacio += 9;
    doc.text("HORA", 153, espacio + 28, null, null);
    doc.text(marker.c_hora, 177, espacio + 28, null, null, "center");
    doc.line(165, espacio + 24, 165, espacio + 29) // vertical line
    doc.line(190, espacio + 24, 190, espacio + 29) // vertical line
    doc.line(165, espacio + 29, 190, espacio + 29);
    doc.line(165, espacio + 24, 190, espacio + 24);

    espacio -= 4;
    doc.line(50, espacio + 33, 50, espacio + 38)
    doc.line(68, espacio + 33, 68, espacio + 38)
    doc.line(98, espacio + 33, 98, espacio + 38)
    doc.line(117, espacio + 33, 117, espacio + 38)
    doc.line(145, espacio + 33, 145, espacio + 38)
    doc.text("COORDENADAS", 11, espacio + 37, null, null);
    doc.text("LATITUD", 52, espacio + 37, null, null);
    doc.text(marker.c_latitud, 70, espacio + 37, null, null);
    doc.text("LONGITUD", 100, espacio + 37, null, null);
    doc.text(marker.c_longitud, 119, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.line(50, espacio + 38, 145, espacio + 38);

    espacio += 8;
    doc.text("TIPO DE EVENTO", 11, espacio + 37, null, null);
    doc.text("SINIESTRO", 50, espacio + 37, null, null);
    if (marker.n_siniestrorobo.toString() == "1") {
      doc.text("X", 80, espacio + 37, null, null, "center");
    } else {
      doc.text("X", 125, espacio + 37, null, null, "center");
    }
    doc.text("ROBO", 100, espacio + 37, null, null);
    doc.text(":", 48, espacio + 37, null, null);
    doc.line(70, espacio + 34, 70, espacio + 38);
    doc.line(90, espacio + 34, 90, espacio + 38);
    doc.line(115, espacio + 34, 115, espacio + 38);
    doc.line(135, espacio + 34, 135, espacio + 38);
    doc.line(70, espacio + 34, 90, espacio + 34);
    doc.line(115, espacio + 34, 135, espacio + 34);
    doc.line(70, espacio + 38, 90, espacio + 38);
    doc.line(115, espacio + 38, 135, espacio + 38);

    espacio += 6
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text("DESCRIPCIÓN DE EQUIPOS ROBADOS", 11, espacio + 37, null, null);
    doc.line(11, espacio + 38, 63.5, espacio + 38);
    espacio += 24

    doc.setFontStyle("Calibri Light");
    doc.line(18, espacio + 16, 193, espacio + 16); // Linea Horizontal Up
    doc.line(18, espacio + 16, 18, espacio + 21) // vertical line
    doc.line(28, espacio + 16, 28, espacio + 21) // vertical line
    doc.line(90, espacio + 16, 90, espacio + 21) // vertical line
    doc.line(108, espacio + 16, 108, espacio + 21) // vertical line
    doc.line(193, espacio + 16, 193, espacio + 21) // vertical line
    doc.line(18, espacio + 21, 193, espacio + 21); // Linea Horizontal Down
    doc.setFontSize(9);
    doc.text("ITEM", 23, espacio + 19.5, null, null, "center");
    doc.text("DATOS DE EQUIPO", 63, espacio + 19.5, null, null, "center");
    doc.text("CANTIDAD", 99, espacio + 19.5, null, null, "center");
    doc.text("OBSERVACIÓN", 150, espacio + 19.5, null, null, "center");

    for (var j = 0; j < this.equipos.length; j++) {
      var itemequipo = this.equipos[j];
      console.log('item' + (j + 1));
      console.log(itemequipo);
      espacio += 5;
      doc.line(18, espacio + 16, 18, espacio + 21) // vertical line
      doc.line(28, espacio + 16, 28, espacio + 21) // vertical line
      doc.line(90, espacio + 16, 90, espacio + 21) // vertical line
      doc.line(108, espacio + 16, 108, espacio + 21) // vertical line
      doc.line(193, espacio + 16, 193, espacio + 21) // vertical line
      doc.line(18, espacio + 21, 193, espacio + 21); // Linea Horizontal Down
      doc.setFontSize(10);
      doc.text((j + 1).toString(), 23.5, espacio + 20, null, null, "center");
      doc.text(itemequipo.c_valor, 29, espacio + 20, null, null);
      doc.text("1", 99, espacio + 20, null, null, "center");
      doc.setFontSize(7);
      doc.text(itemequipo.c_observacion, 109, espacio + 20, null, null);
      doc.setFontSize(10);
    }
    espacio = 135;
    doc.setFontStyle("Calibri");
    doc.setFontSize(11);
    doc.text("CIRCUNSTANCIAS DEL ROBO: .........................................................................................................................................", 11, espacio + 37, null, null);
    doc.text(marker.c_observacion, 67.5, espacio + 35.65, null, null);
    espacio += 7;
    doc.text("...................................................................................................................................................................................................", 11, espacio + 37, null, null);
    espacio += 7;
    doc.text("...................................................................................................................................................................................................", 11, espacio + 37, null, null);

    espacio += 26;
    doc.setFontStyle("bold");
    doc.setLineWidth(0.5)
    doc.line(18, espacio + 16, 193, espacio + 16); // Linea Horizontal Up
    doc.line(18, espacio + 16, 18, espacio + 70.14) // vertical line
    doc.line(193, espacio + 16, 193, espacio + 70.14) // vertical line
    doc.line(18, espacio + 70, 193, espacio + 70); // LineaHorizontal FInal

    doc.setFontSize(11);
    doc.text("AUTORIDAD QUE CERTIFICA", 108, espacio + 20, null, null, "center");

    doc.text("DATOS PERSONALES", 19, espacio + 30, null, null);
    doc.text(marker.c_autoridad, 72, espacio + 29.5, null, null);
    doc.text(":", 70, espacio + 30, null, null);
    doc.setLineWidth(0.1)
    doc.line(72, espacio + 30, 180, espacio + 30);

    espacio += 5
    doc.text("DNI", 19, espacio + 30, null, null);
    doc.text(marker.c_dniautoridad, 72, espacio + 29.5, null, null);
    doc.text(":", 70, espacio + 30, null, null);
    doc.setLineWidth(0.1)
    doc.line(72, espacio + 30, 180, espacio + 30);

    espacio += 5
    doc.text("CARGO", 19, espacio + 30, null, null);
    doc.text("", 72, espacio + 29.5, null, null);
    doc.text(":", 70, espacio + 30, null, null);
    doc.setLineWidth(0.1)
    doc.line(72, espacio + 30, 180, espacio + 30);

    espacio += 5
    doc.text("DISTRITO", 19, espacio + 30, null, null);
    doc.text(marker.c_distrito, 72, espacio + 29.5, null, null);
    doc.text(":", 70, espacio + 30, null, null);
    doc.setLineWidth(0.1)
    doc.line(72, espacio + 30, 180, espacio + 30);

    espacio += 5
    doc.text("LOCALIDAD", 19, espacio + 30, null, null);
    doc.text(marker.c_centropoblado, 72, espacio + 29.5, null, null);
    doc.text(":", 70, espacio + 30, null, null);
    doc.setLineWidth(0.1)
    doc.line(72, espacio + 30, 180, espacio + 30);

    espacio += 5
    doc.text("COMENTARIOS", 19, espacio + 30, null, null);
    doc.text(marker.c_observacion, 72, espacio + 29.5, null, null);
    doc.text(":", 70, espacio + 30, null, null);
    doc.setLineWidth(0.1)
    doc.line(72, espacio + 30, 180, espacio + 30);

    doc.setFontStyle("Calibri Light");
    doc.line(19.5, espacio + 35, 190, espacio + 35);
    doc.line(19.5, espacio + 40, 190, espacio + 40);

    espacio += 12;
    doc.setFontSize(11);
    doc.setFontStyle("Calibri Light");
    doc.text("En conformidad a lo estipulado en la presente acta, extendemos y firmamos el dia _______ del mes de _______________", 11, espacio + 37, null, null);
    doc.text("de 20_______", 11, espacio + 45, null, null);
    doc.text(marker.c_fecha.toString().substring(0, 2), 143.5, espacio + 37, null, null);
    doc.text(marker.c_fecha.toString().substring(3, 5), 180, espacio + 37, null, null);
    doc.text(marker.c_fecha.toString().substring(8, 10), 24, espacio + 44.5, null, null);


    espacio = 265;
    doc.setFontSize(10);
    doc.setLineWidth(0)
    doc.line(11, espacio + 16, 61, espacio + 16);
    var img1 = new Image();
    // img1.src = "../../../../assets/images/fernando_firma.png";
    // doc.addImage(imgData, "PNG", 13,espacio-5,45,18);
    doc.text("AUTORIDAD LOCAL", 19, espacio + 20.5, null, null);
    doc.text("Nombre:", 11, espacio + 26, null, null);
    doc.setFontSize(8);
    doc.text(marker.c_autoridad, 24, espacio + 26, null, null);
    doc.setFontSize(10);
    doc.text("DNI:", 11, espacio + 30, null, null);
    doc.text(marker.c_dniautoridad, 19, espacio + 30, null, null);
    var img2 = new Image()
    // img2.src = "../../../../assets/images/fernando_firma.png";
    // doc.addImage(imgData, "PNG", 82,espacio-5,45,18);
    doc.line(80, espacio + 16, 130, espacio + 16);
    doc.text("CLIENTE", 97, espacio + 20.5, null, null);
    doc.text("Nombre:", 80, espacio + 26, null, null);
    doc.setFontSize(8);
    doc.text(marker.c_nombres + ', ' + marker.c_appaterno + ' ' + marker.c_apmaterno, 94, espacio + 26, null, null);
    doc.setFontSize(10);
    doc.text("DNI:", 80, espacio + 30, null, null);
    doc.text(marker.c_dni, 89, espacio + 30, null, null);
    var img3 = new Image()
    //img3.src = "../../../../assets/images/fernando_firma.png";
    //doc.addImage(imgData, "PNG", 152,espacio-5,45,18);
    doc.line(150, espacio + 16, 200, espacio + 16);
    doc.text("TÉCNICO", 165, espacio + 20.5, null, null);
    doc.text("Nombre:", 150, espacio + 26, null, null);
    doc.setFontSize(8);
    doc.text(marker.c_tecnico, 163, espacio + 26, null, null);
    doc.setFontSize(10);
    doc.text("DNI:", 150, espacio + 30, null, null);
    doc.text(marker.c_dnitecnico, 159, espacio + 30, null, null);


    let nombrePDF = 'ROBO_SINIESTRO' + '.pdf';

    doc.save(nombrePDF);
    this.i = this.i + 1;
    setTimeout(() => {

      console.log("Archivo descargado " + this.i);
      if (this.cantidad >= this.i) {
        this.descargarpdf(datosmnt)
      } else {
        this.edited = false;
      }
    }, 1000);
  }
}
