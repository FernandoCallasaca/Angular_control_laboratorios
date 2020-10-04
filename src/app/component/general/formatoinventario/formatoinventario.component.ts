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
  selector: 'app-formatoinventario',
  templateUrl: './formatoinventario.component.html',
  styleUrls: ['./formatoinventario.component.css'],
  providers: [SeguridadService, MapaService, GeneralService, ExcelService]
})
export class FormatoinventarioComponent extends BaseComponent implements OnInit {

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
  lamparasall = [];
  equipos = [];
  equiposall = [];
  componentes = [];
  componentesall = [];
  // Agregamos periodo
  periodos = [];
  // Agregamos Usuario
  usuarios = []
  // Agregamos arrego de mantenimientos
  mantenimientos = []

  iddepartamento: number = 6;
  idprovincia: number = 63;
  iddistrito: number = 653;
  idcentropoblado: number = 430;
  identidad: number = 0;
  // Inicializamos el periodo
  idperiodo: number = 6;
  idusuario: number = 0;
  idtipoprograma: number = 1;
  idsistemafotovoltaico: number = 0;

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

  downloadInventario() {

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


                      this._mapa_service.getLamparasAll(req1, this.getToken().token).subscribe(
                        result5 => {

                          let resultado5 = <ResultadoApi>result5;

                          if (resultado5.estado) {
                            this.lamparasall = resultado5.data;

                            console.log(this.lamparasall);

                            this._mapa_service.getComponentesAll(req1, this.getToken().token).subscribe(
                              result6 => {

                                let resultado6 = <ResultadoApi>result6;

                                if (resultado6.estado) {
                                  this.componentesall = resultado6.data;

                                  console.log(this.componentesall);

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
                                          this.lamparas = this.lamparasall.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);
                                          this.componentes = this.componentesall.filter(x => x.n_idmnt_sistemafotovoltaico == marker.n_idmnt_sistemafotovoltaico);

                                          console.log(this.respuestas);
                                          console.log(this.equipos);
                                          console.log(this.detalles);
                                          console.log(this.lamparas);
                                          console.log(this.componentes);


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

                                        let nombrePDF = 'Acta_Inspeccion.pdf';
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
                                  this.openSnackBar(resultado6.mensaje, 99);
                                }

                              }, error => {
                                try {
                                  this.openSnackBar(error.error.Detail, error.error.StatusCode);
                                } catch (error) {
                                  this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
                                }
                              });

                          } else {
                            this.openSnackBar(resultado5.mensaje, 99);
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
