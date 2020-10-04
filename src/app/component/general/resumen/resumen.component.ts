import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})

export class ResumenComponent implements OnInit {

  tabla4: MatTableDataSource<any>;
  displayedColumns4: string[] = ['proyecto', 'estado', 'avance', 'lp', 'rp', 'rs', 'aco', 'presupuestobase', 'presupuestoprogramado', 'presupuestoejecutado', 'inicio', 'fin'];
  @ViewChild(MatPaginator, { static: false }) paginator4: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort4: MatSort;

  resumen = [
    {
      proyecto: "San Ignacio",
      estado: "Ejecución",
      avance: "64.32%",
      l: "126 Localidades",
      lp: "102.8 km",
      rp: "20.46 Km",
      rs: "401.34 Km",
      aco: "4205",
      presupuestobase: 23857039.07,
      presupuestoprogramado: 19942418.40,
      presupuestoproejecutado: 18853658.3,
      plazo: "425 días",
      meses: "14",
      inicio: "ago-18",
      fin: "oct-19"
    },
    {
      proyecto: "Dos de Mayo",
      estado: "Ejecución",
      avance: "87.11%",
      l: "419 Localidades",
      lp: "101.76 km",
      rp: "41.23 Km",
      rs: "570.70 Km",
      aco: "4,757",
      presupuestobase: 25273946.68,
      presupuestoprogramado: 19306269.99,
      presupuestoproejecutado: 19503430.16,
      plazo: "476 días",
      meses: "15.9",
      inicio: "ago-18",
      fin: "dic-19"
    },
    {
      proyecto: "Huamachuco",
      estado: "Ejecución",
      avance: "89.08%",
      l: "85 Localidades",
      lp: "126.53 km",
      rp: "21.45 Km",
      rs: "144.92 Km",
      aco: "1,554",
      presupuestobase: 12068022.08,
      presupuestoprogramado: 10831490.79,
      presupuestoproejecutado: 9648577.16,
      plazo: "423 días",
      meses: "14.1",
      inicio: "oct-18",
      fin: "dic-19"
    },
    {
      proyecto: "San José",
      estado: "Ejecución",
      avance: "82.69%",
      l: "105 Localidades",
      lp: "75.99 km",
      rp: "5.92 Km",
      rs: "17.95 Km",
      aco: "2,079",
      presupuestobase: "15,009,128.83",
      presupuestoprogramado: "10,460,000.85",
      presupuestoproejecutado: "9,982,179.66",
      plazo: "425 días",
      meses: "14.1",
      inicio: "sep-18",
      fin: "nov-19"
    },
    {
      proyecto: "Chota",
      estado: "Ejecución",
      avance: "81.75%",
      l: "442 Localidades",
      lp: "260 km",
      rp: "193.25 Km",
      rs: "1,836.8 Km",
      aco: "19,251",
      presupuestobase: "101,122,309,61",
      presupuestoprogramado: "67,211,067.06",
      presupuestoproejecutado: "65,980,438.18",
      plazo: "540 días",
      meses: "18",
      inicio: "jul-18",
      fin: "dic-19"
    },
    {
      proyecto: "POBESI",
      estado: "Ejecución",
      avance: "92.34%",
      l: "134 Localidades",
      lp: "147.43 km",
      rp: "4.3 Km",
      rs: "223.83 Km",
      aco: "2,282",
      presupuestobase: "18,560,537.48",
      presupuestoprogramado: "67,211,067.06",
      presupuestoproejecutado: "65,980,438.18",
      plazo: "425 días",
      meses: "14.1",
      inicio: "ene-18",
      fin: "feb-19"
    }

  ]

  displayedColumns: string[] = ['item', 'cost'];
  transactions: Transaction[] = [
    {item: 'Beach ball', cost: 4},
    {item: 'Towel', cost: 5},
    {item: 'Frisbee', cost: 2},
    {item: 'Sunscreen', cost: 4},
    {item: 'Cooler', cost: 25},
    {item: 'Swim suit', cost: 15},
  ];

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  constructor() { }

  ngOnInit() {
    this.getTabla4();
  }

  getTabla4() {
    this.tabla4 = new MatTableDataSource<any>(this.resumen);
    this.tabla4.sort = this.sort4;
    this.tabla4.paginator = this.paginator4;
}

}
