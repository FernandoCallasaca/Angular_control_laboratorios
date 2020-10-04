import { Component, OnInit, Input } from '@angular/core';

import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
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
  selector: 'app-formato-reclamo',
  templateUrl: './formato-reclamo.component.html',
  styleUrls: ['./formato-reclamo.component.css'],
  providers: [SeguridadService, MapaService, GeneralService, ExcelService]
})
export class FormatoReclamoComponent extends BaseComponent implements OnInit {

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
  usuarios = [];
  reclamo = []

  @Input() iddepartamento: number = 0;
  @Input() idprovincia: number = 0;
  @Input() iddistrito: number = 0;
  @Input() idcentropoblado: number = 0;
  @Input() identidad: number = 0;
  @Input() idusuario: number = 0;
  @Input() idreclamo: number = 1;
  @Input() dateinicio;
  @Input() datefin;

  geoJsonObject: Object;
  markers = [];

  i = 1;
  cantidad = 0;

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

  downloadFormatoReclamo() {
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
      n_idseg_user: this.idusuario,
      n_idrec_reclamo: this.idreclamo,
      dateinicio: this.dateinicio,
      datefin: this.datefin
    }
    this._mapa_service.getDataFormatoReclamo(req1, this.getToken().token).subscribe(
      result => {
        console.log("Paso 1...");

        let resultado1 = < ResultadoApi > result;

        if (resultado1.estado) {
          this.markers = [];
          console.log(resultado1);
          // listado de fotos

          this._mapa_service.getDetalleReclamoAll(req1, this.getToken().token).subscribe(
            result4 => {
              
              let resultado4 = < ResultadoApi > result4;

              if (resultado4.estado) {
                console.log(resultado4);
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

  descargarpdf(datosreclamo){
    var doc = new JsPDF();
    console.log("Crear reportes..." + this.i);
    let element = datosreclamo[this.i - 1];
    let marker = element;
    console.log(marker);

    this.detalles = this.detallesAll.filter(x => x.n_idrec_reclamo == marker.n_idrec_reclamo);

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

    espacio += 20;
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
    doc.text(marker.c_nametecnico + ', ' + marker.c_lastnametecnico, 134, espacio + 20.5);

    espacio += 5;
    doc.text('DNI:', 15, espacio + 20.5);
    doc.text(marker.c_dni, 30, espacio + 20.5);
    doc.text('DNI:', 120, espacio + 20.5);
    doc.text(marker.c_dnitecnico, 134, espacio + 20.5);

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
    
    let nombrePDF = 'mnt_' + marker.c_codigo + '_' + marker.n_idrec_reclamo + '.pdf';

    doc.save(nombrePDF);
    this.i = this.i + 1;
    setTimeout(() => {
      console.log("Archivo descargado " + this.i);
      if (this.cantidad >= this.i) {
        this.descargarpdf(datosreclamo)
      } else {
        this.edited = false;
      }
    }, 1000);
  }
}
