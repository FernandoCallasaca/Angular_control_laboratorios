
import { Component,Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Confirmar} from '../../../interface/confirmar.interface';

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarComponent>,
  
    @Inject(MAT_DIALOG_DATA) public data: Confirmar ) {
  }

  public onOkClick ():void{
    this.data.resultado=true;
    this.dialogRef.close(this.data);
  }


  onNoClick(): void {
    this.data.resultado=false;
    this.dialogRef.close(this.data);
  }
}


