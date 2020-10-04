import { Component, OnInit, Input } from '@angular/core';
import { MapaService } from '../../../service/mapa.services';
import { AppSettings } from '../../../common/appsettings';
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
  selector: 'app-repartomasivo',
  templateUrl: './repartomasivo.component.html',
  styleUrls: ['./repartomasivo.component.css'],
  providers: [SeguridadService, MapaService, GeneralService, ExcelService]
})

export class RepartomasivoComponent extends BaseComponent implements OnInit {

  departamentos = [];
  provincias = [];
  distritos = [];
  centropoblados = [];
  entidades = [];
  puntos = [];
  dataexport = [];
  detalles = [];
  detallesAll = [];
  usuarios = [];
  reclamo = [];

  @Input() iddepartamento: number = 0;
  @Input() idprovincia: number = 0;
  @Input() iddistrito: number = 0;
  @Input() idcentropoblado: number = 0;
  @Input() identidad: number = 0;
  @Input() idusuario: number = 0;
  @Input() idreclamo: number = 0;
  @Input() idperiodo: number = 0;
  @Input() idreparto: number = 0;
  @Input() dateinicio: string = '2011/12/01';
  @Input() datefin: string = '2021/12/01';

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

  ngOnInit() {
  }

  getxlsReparto() {
    let req = {
      n_idgen_departamento: this.iddepartamento,
      n_idgen_provincia: this.idprovincia,
      n_idgen_distrito: this.iddistrito,
      n_idgen_centropoblado: this.idcentropoblado,
      n_idgen_entidad: this.identidad,
      n_idgen_periodo: this.idperiodo,
      n_idseg_user: this.idusuario,
      n_idrep_reparto: this.idreparto,
      dateinicio: this.dateinicio,
      datefin: this.datefin
    }
    this._mapa_service.getxlsReparto(req, this.getToken().token).subscribe(
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
  export() {
    this.getxlsReparto();
  }
  downloadFormatoReparto() {

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
      n_idrep_reparto: this.idreparto,
      dateinicio: this.dateinicio,
      datefin: this.datefin
    }
    this._general_service.getReparto(req1, this.getToken().token).subscribe(
      result => {
        console.log("Paso 1...");

        let resultado1 = < ResultadoApi > result;

        if (resultado1.estado) {
          this.markers = [];

          // listado de fotos
          this._mapa_service.getdetalleRepartoAll(req1, this.getToken().token).subscribe(
            result4 => {

              let resultado4 = < ResultadoApi > result4;

              if (resultado4.estado) {

                this.detallesAll = resultado4.data;

                console.log(this.detallesAll);
                this.cantidad = resultado1.data.length;
                console.log(this.cantidad);
                this.i = 1;
                if(resultado1.data.length > 0) {
                  this.descargarpdf(resultado1.data);
                }
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

  descargarpdf(datosreparto) {
    var doc = new JsPDF();
    console.log("Crear reportes..." + this.i);
    let element = datosreparto[this.i - 1];
    let marker = element;
    console.log(this.detalles);
    var espacio = 2

    this.detalles = this.detallesAll.filter(x => x.n_idrec_reclamo == marker.n_idrec_reclamo);
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
    doc.text(marker.c_codigo, 50, espacio + 39.3, null, null);
    doc.setLineWidth(0.1)
    doc.line(50, espacio + 40, 90, espacio + 40) // horizontal line
    doc.setFontStyle("normal");
    doc.text("CODIGO:", 130, espacio + 35, null, null);
    doc.text(marker.n_idrep_reparto.toString(), 163, espacio + 35, null, null);
    espacio += 5;
    doc.text("FECHA Y HORA:", 130, espacio + 37, null, null);
    doc.text(element.c_fecha, 163, espacio + 37, null, null);
    doc.text("-", 181, espacio + 37, null, null);
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

    let nombrePDF = 'reparto_' + marker.c_codigo + '_' + marker.n_idrep_reparto + '.pdf';

    doc.save(nombrePDF);
    this.i = this.i + 1;
    setTimeout(() => {
      console.log("Archivo descargado " + this.i);
      if (this.cantidad >= this.i) {
        this.descargarpdf(datosreparto)
      } else {
        this.edited = false;
      }
    }, 1000);

  }
}
