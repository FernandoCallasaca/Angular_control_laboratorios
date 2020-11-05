import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../../service/dashboard.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ResultadoApi } from '../../../interface/common.interface';
import { BaseComponent } from '../../base/base.component';
import { AppSettings } from '../../../common/appsettings';
@Component({
  selector: 'app-dashboad',
  templateUrl: './dashboad.component.html',
  styleUrls: ['./dashboad.component.css'],
  providers: [DashboardService],
})
export class DashboadComponent extends BaseComponent implements OnInit {
  public myChartEstado: any;
  public myChartKml: any;

  public myChartProductoCantidad: any;


  public myChartBenefiario: any;
  public myChartDepartamentos: any;
  public myChartLocalidades: any;
  public myChartTipoMantenimiento: any;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private dashboardServices: DashboardService
  ) {
    super(snackBar, router);
  }

  ngOnInit() {
    this.getProductoCatalogo();
    // this.getFecha();
    // this.getDepartamento();
    // this.getTipoMantenimiento();
  }

  getProductoCatalogo() {
    this.dashboardServices.getProductoCatalogo(this.getToken().token).subscribe(
      (result) => {
        const resultado = <ResultadoApi>result;
        // tslint:disable-next-line: align
        if (resultado.estado) {
          console.log(resultado);

          this.myChartProductoCantidad = new Chart('dashboardproductocantidad', {
            type: 'bar',
            data: {
              labels: resultado.data.productos,
              datasets: [
                {
                  data: resultado.data.cantidades,
                  backgroundColor: [
                    'rgba(255, 235, 59,1.0)',
                    'rgba(255, 193, 7,1.0)',
                    'rgba(255, 152, 0,1.0)',
                    'rgba(255, 87, 34,1.0)',
                    'rgba(121, 85, 72,1.0)',
                    'rgba(136, 14, 79,1.0)',
                    'rgba(74, 20, 140,1.0)',
                    'rgba(49, 27, 146,1.0)',
                    'rgba(26, 35, 126,1.0)',
                    'rgba(51, 105, 30,1.0)',
                    'rgba(255, 99, 132)',
                    'rgba(244, 67, 54,1.0)',
                    'rgba(156, 39, 176,1.0)',
                    'rgba(103, 58, 183,1.0)',
                    'rgba(63, 81, 181,1.0)',
                    'rgba(33, 150, 243,1.0)',
                    'rgba(3, 169, 244,1.0)',
                    'rgba(0, 188, 212,1.0)',
                    'rgba(0, 150, 136,1.0)',
                    'rgba(76, 175, 80,1.0)',
                    'rgba(139, 195, 74,1.0)',
                    'rgba(205, 220, 57,1.0)',
                    'rgba(62, 39, 35,1.0)',

                  ],
                  borderColor: [

                    'rgba(255, 235, 59,1.0)',
                    'rgba(255, 193, 7,1.0)',
                    'rgba(255, 152, 0,1.0)',
                    'rgba(255, 87, 34,1.0)',
                    'rgba(121, 85, 72,1.0)',
                    'rgba(136, 14, 79,1.0)',
                    'rgba(74, 20, 140,1.0)',
                    'rgba(49, 27, 146,1.0)',
                    'rgba(26, 35, 126,1.0)',
                    'rgba(51, 105, 30,1.0)',
                    'rgba(255, 99, 132)',
                    'rgba(244, 67, 54,1.0)',
                    'rgba(156, 39, 176,1.0)',
                    'rgba(103, 58, 183,1.0)',
                    'rgba(63, 81, 181,1.0)',
                    'rgba(33, 150, 243,1.0)',
                    'rgba(3, 169, 244,1.0)',
                    'rgba(0, 188, 212,1.0)',
                    'rgba(0, 150, 136,1.0)',
                    'rgba(76, 175, 80,1.0)',
                    'rgba(139, 195, 74,1.0)',
                    'rgba(205, 220, 57,1.0)',
                    'rgba(62, 39, 35,1.0)',

                  ],
                  borderWidth: 1
                },
              ],
            },
            options: {
              legend: { display: false },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        } else {
          this.openSnackBar(resultado.mensaje, 99);
        }
      },
      (error) => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      }
    );
  }

  getFecha() {
    this.dashboardServices.getFecha(this.getToken().token).subscribe(
      (result) => {
        const resultado = <ResultadoApi>result;
        // tslint:disable-next-line: align
        if (resultado.estado) {
          console.log(resultado);

          this.myChartBenefiario = new Chart('beneficiearioproyecto', {
            type: 'bar',
            data: {
              labels: resultado.data.fechas,
              datasets: [
                {
                  label: 'Mantenimientos/Inventarios',
                  data: resultado.data.cantidades,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',

                    'rgba(36, 113, 163, 0.7)',
                    'rgba(120, 40, 31, 1)',
                    'rgba(203, 67, 53, 1)',
                    'rgba(20, 143, 119, 1)',
                    'rgba(212, 172, 13, 1)',
                    'rgba(230, 126, 34, 1)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',

                    'rgba(36, 113, 163, 1)',
                    'rgba(120, 40, 31, 1)',
                    'rgba(203, 67, 53, 1)',
                    'rgba(20, 143, 119, 1)',
                    'rgba(212, 172, 13, 1)',
                    'rgba(230, 126, 34, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            },
          });
        } else {
          this.openSnackBar(resultado.mensaje, 99);
        }
      },
      (error) => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      }
    );
  }

  getDepartamento() {
    this.dashboardServices.getDepartamento(this.getToken().token).subscribe(
      (result) => {
        let resultado = <ResultadoApi>result;
        if (resultado.estado) {
          console.log(resultado);

          this.myChartDepartamentos = new Chart('beneficiariodepartamento', {
            type: 'doughnut',
            data: {
              labels: resultado.data.departamentos,
              datasets: [
                {
                  label: 'Mantenimientos',
                  data: resultado.data.cantidades,
                  backgroundColor: [
                    'rgba(36, 113, 163, 1)',
                    'rgba(120, 40, 31, 1)',
                    'rgba(203, 67, 53, 1)',
                    'rgba(20, 143, 119, 1)',
                    'rgba(212, 172, 13, 1)',
                    'rgba(230, 126, 34, 1)',
                  ],
                  borderColor: [
                    'rgba(36, 113, 163, 1)',
                    'rgba(120, 40, 31, 1)',
                    'rgba(203, 67, 53, 1)',
                    'rgba(20, 143, 119, 1)',
                    'rgba(212, 172, 13, 1)',
                    'rgba(230, 126, 34, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            },
          });
        } else {
          this.openSnackBar(resultado.mensaje, 99);
        }
      },
      (error) => {
        try {
          this.openSnackBar(error.error.Detail, error.error.StatusCode);
        } catch (error) {
          this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
        }
      }
    );
  }
  getTipoMantenimiento() {
    this.dashboardServices
      .getTipoMantenimiento(this.getToken().token)
      .subscribe(
        (result) => {
          let resultado = <ResultadoApi>result;
          if (resultado.estado) {
            console.log(resultado);

            this.myChartTipoMantenimiento = new Chart(
              'beneficiariomantenimiento',
              {
                type: 'pie',
                data: {
                  labels: resultado.data.tiposmantenimientos,
                  datasets: [
                    {
                      label: 'Mantenimientos',
                      data: resultado.data.cantidades,
                      backgroundColor: [
                        'rgba(36, 113, 163, 0.5)',
                        'rgba(120, 40, 31, 0.5)',
                      ],
                      borderColor: [
                        'rgba(36, 113, 163, 1)',
                        'rgba(120, 40, 31, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                },
              }
            );
          } else {
            this.openSnackBar(resultado.mensaje, 99);
          }
        },
        (error) => {
          try {
            this.openSnackBar(error.error.Detail, error.error.StatusCode);
          } catch (error) {
            this.openSnackBar(AppSettings.SERVICE_NO_CONECT_SERVER, 99);
          }
        }
      );
  }
}
