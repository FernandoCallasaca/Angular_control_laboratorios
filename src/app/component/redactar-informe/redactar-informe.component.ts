import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para utilizar un formulario reactivo
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { GeneralService } from './../../service/general.service';
import { BaseComponent } from './../base/base.component';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/common/appsettings';

@Component({
  selector: 'app-redactar-informe',
  templateUrl: './redactar-informe.component.html',
  styleUrls: ['./redactar-informe.component.css'],
  providers: [GeneralService]
})
export class RedactarInformeComponent extends BaseComponent implements OnInit {

  form: FormGroup;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private generalService: GeneralService,
    private formBuilder: FormBuilder
  ) {
    super(snackBar, router);
    this.buildForm();
  }

  ngOnInit() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      price: [0, [Validators.required]],
      image: '',
      description: ['', [Validators.required]]
    });
  }

  saveProducts(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
