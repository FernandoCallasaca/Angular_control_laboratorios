import { Component, OnInit,Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
import {SnackInterface} from '../../../interface/snack.interface';
@Component({
  selector: 'app-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.css'],
})


export class SnackComponent implements OnInit {
  mensaje:String;
  tipo: number;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackInterface) { }

  ngOnInit() {
    this.mensaje = this.data.mensaje;
    this.tipo= this.data.tipo;

  }

}
