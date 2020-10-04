import { Component, OnInit } from '@angular/core';

import {
  MatPaginator,
  MatTableDataSource,
  MatSort
} from '@angular/material';
import { MapaService } from '../../../service/mapa.services';
import { AppSettings } from '../../../common/appsettings'
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
  selector: 'app-formatomantenimiento',
  templateUrl: './formatomantenimiento.component.html',
  styleUrls: ['./formatomantenimiento.component.css'],
  providers: [SeguridadService, MapaService, GeneralService, ExcelService]
})
export class FormatomantenimientoComponent extends BaseComponent implements OnInit {

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
  detallesAll = [];
  respuestas = [];
  respuestasall = [];
  lamparas = [];
  equipos = [];
  equiposall = [];
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
  idtipoprograma: number = 0;
  idsistemafotovoltaico: number = 1;

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

  ngOnInit() {

  }



  downloadMantenimiento() {

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
      n_idmnt_sistemafotovoltaico: this.idsistemafotovoltaico
    }

    console.log("Iniciando proceso de exportación...");

    this._mapa_service.getDataFormato(req1, this.getToken().token).subscribe(
      result => {
        console.log("Paso 1...");

        let resultado1 = <ResultadoApi>result;

        if (resultado1.estado) {
          this.markers = [];

          // listado de respuestas

          this._mapa_service.getRespuestaAll(req1, this.getToken().token).subscribe(
            result2 => {

              let resultado2 = <ResultadoApi>result2;

              if (resultado2.estado) {
                this.respuestasall = resultado2.data;

                console.log(this.respuestasall);

                // listado de equipos

                this._mapa_service.getEquiposAll(req1, this.getToken().token).subscribe(
                  result3 => {

                    let resultado3 = <ResultadoApi>result3;

                    if (resultado3.estado) {
                      this.equiposall = resultado3.data;

                      console.log(this.equiposall);

                      this._mapa_service.getDetalleAll(req1, this.getToken().token).subscribe(
                        result4 => {

                          let resultado4 = <ResultadoApi>result4;

                          if (resultado4.estado) {

                            this.detallesAll = resultado4.data;

                            console.log(this.detallesAll);

                            var doc = new JsPDF();

                            var i = 1;
                            // crear reporte
                            resultado1.data.forEach(element => {

                              if (i > 1) {
                                doc.addPage();
                              }

                              console.log("Crear reportes...");

                              let marker = element;

                              console.log(marker);

                              this.respuestas = this.respuestasall.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);
                              this.equipos = this.equiposall.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);
                              this.detalles = this.detallesAll.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);

                              console.log(this.respuestas);
                              console.log(this.equipos);
                              console.log(this.detalles);

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
                              let foto11 = this.detalles.find(x => x.c_tipo == 'Firma Usuario');
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
                              let foto12 = this.detalles.find(x => x.c_tipo == 'Firma Técnico');
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

                              let foto1 = this.detalles.find(x => x.n_fila == 1 && x.n_tipo == 1);
                              if (foto1 != null) {
                                doc.text(foto1.c_tipo, 15, espacio + 20);
                                var img = new Image();
                                img.src = foto1.c_nombrefoto;
                                doc.addImage(img, "JPEG", 15, espacio + 25, 50, 50);
                              }

                              let foto2 = this.detalles.find(x => x.n_fila == 2 && x.n_tipo == 1);
                              if (foto2 != null) {
                                doc.text(foto2.c_tipo, 75, espacio + 20);
                                var img = new Image()
                                img.src = foto2.c_nombrefoto;
                                doc.addImage(img, "JPEG", 75, espacio + 25, 50, 50);
                              }

                              let foto3 = this.detalles.find(x => x.n_fila == 3 && x.n_tipo == 1);
                              if (foto3 != null) {
                                doc.text(foto3.c_tipo, 135, espacio + 20);
                                var img = new Image()
                                img.src = foto3.c_nombrefoto;
                                doc.addImage(img, "JPEG", 135, espacio + 25, 50, 50);
                              }

                              let foto4 = this.detalles.find(x => x.n_fila == 4 && x.n_tipo == 1);
                              if (foto4 != null) {
                                doc.text(foto4.c_tipo, 15, espacio + 80);
                                var img = new Image()
                                img.src = foto4.c_nombrefoto;
                                doc.addImage(img, "JPEG", 15, espacio + 85, 50, 50);
                              }

                              let foto5 = this.detalles.find(x => x.n_fila == 5 && x.n_tipo == 1);
                              if (foto5 != null) {
                                doc.text(foto5.c_tipo, 75, espacio + 80);
                                var img = new Image()
                                img.src = foto5.c_nombrefoto;
                                doc.addImage(img, "JPEG", 75, espacio + 85, 50, 50);
                              }

                              let foto6 = this.detalles.find(x => x.n_fila == 6 && x.n_tipo == 1);
                              if (foto6 != null) {
                                doc.text(foto6.c_tipo, 135, espacio + 80);
                                var img = new Image()
                                img.src = foto6.c_nombrefoto;
                                doc.addImage(img, "JPEG", 135, espacio + 85, 50, 50);
                              }

                              let foto7 = this.detalles.find(x => x.n_fila == 7 && x.n_tipo == 1);
                              if (foto7 != null) {
                                doc.text(foto7.c_tipo, 15, espacio + 140);
                                var img = new Image()
                                img.src = foto7.c_nombrefoto;
                                doc.addImage(img, "JPEG", 15, espacio + 145, 50, 50);
                              }

                              let foto8 = this.detalles.find(x => x.n_fila == 8 && x.n_tipo == 1);
                              if (foto8 != null) {
                                doc.text(foto8.c_tipo, 75, espacio + 140);
                                var img = new Image()
                                img.src = foto8.c_nombrefoto;
                                doc.addImage(img, "JPEG", 75, espacio + 145, 50, 50);
                              }

                              let foto9 = this.detalles.find(x => x.n_fila == 9 && x.n_tipo == 1);
                              if (foto9 != null) {
                                doc.text(foto9.c_tipo, 135, espacio + 140);
                                var img = new Image()
                                img.src = foto9.c_nombrefoto;
                                doc.addImage(img, "JPEG", 135, espacio + 145, 50, 50);
                              }

                              let foto10 = this.detalles.find(x => x.n_fila == 10 && x.n_tipo == 1);
                              if (foto10 != null) {
                                doc.text(foto10.c_tipo, 15, espacio + 200);
                                var img = new Image()
                                img.src = foto10.c_nombrefoto;
                                doc.addImage(img, "JPEG", 15, espacio + 205, 50, 50);
                              }

                              //doc.addPage();

                              i = i + 1;

                            });

                            this.edited = false;

                            let nombrePDF = 'Acta_Mantenimiento.pdf';
                            doc.save(nombrePDF);

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
                      this.openSnackBar(resultado3.mensaje, 99);
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

}
