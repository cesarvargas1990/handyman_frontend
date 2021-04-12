import { Component, Injectable, OnInit } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RegisterService } from '../../../Services/register.service';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';


const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Agos', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekLabel: 'sem'
  }
 
};

@Injectable()
export class I18n {
  language = 'es';
}



@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {


  constructor(private _i18n: I18n) { super(); }

  getWeekdayShortName(weekday: number): string { return I18N_VALUES[this._i18n.language].weekdays[weekday - 1]; }
  getWeekLabel(): string { return I18N_VALUES[this._i18n.language].weekLabel; }
  getMonthShortName(month: number): string { return I18N_VALUES[this._i18n.language].months[month - 1]; }
  getMonthFullName(month: number): string { return this.getMonthShortName(month); }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.day}-${date.month}-${date.year}`; }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  providers:
    [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class RegisterComponent implements OnInit {

  heading = 'Registrar reporte de servicio';
  subheading = 'Ingrese los datos correspondientes para registrar un reporte de servicio.';
  icon = 'pe-7s-bandaid icon-gradient bg-amy-crisp';
  model: NgbDateStruct;


  timeStart = { hour: 7, minute: 0 };
  timeEnd = { hour: 9, minute: 0 };
  meridian = true;


  reportForm = new FormGroup({
  });

  constructor(private registerService: RegisterService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  saveReport() {
    
    let dateStart = this.reportForm.value['dateStart'];
    let timeEnd = this.reportForm.value['timeEnd'];

    let timeStart = this.reportForm.value['timeStart'];
    let dateEnd = this.reportForm.value['dateEnd'];
    
     
    let serviceDateStart = new Date( dateStart.month + "/" + dateStart.day +"/" + dateStart.year + " "+timeStart.hour+":"+timeStart.minute+":"+"0" );
    let serviceDateEnd = new Date( dateEnd.month + "/" + dateEnd.day +"/" + dateEnd.year + " "+timeEnd.hour+":"+timeEnd.minute+":"+"0" );
 

    if (serviceDateStart.getTime() > serviceDateEnd.getTime() ) {
      Swal.fire({
        type: 'error',
        text: 'La fecha de inicio debe ser mayor a la fecha final',
        title: 'Error en validacion'
      })
      return false;
    }
    const data = {
      'employeeDocumentNumber': this.reportForm.value['employeeDocumentNumber'],
      'serviceId': this.reportForm.value['serviceId'],
      'serviceDateStart': serviceDateStart.getTime(),
      'serviceDateEnd': serviceDateEnd.getTime(),
    }
    console.log(data)
    this.registerService.create(data).subscribe(
      response => {
        Swal.fire({
          type: 'success',
          text: 'Se registro satisfactoriamente el reporte de hora',
          title: 'Registro exitoso'
        })
         
      },  
        error => {
          Swal.fire({
            type: 'error',
            text: 'Ocurrio un error al registrar',
            title: 'Error al registrar'
          })

        }
      
    )
  } 

  createForm() {
    this.reportForm = this.formBuilder.group({
      employeeDocumentNumber: ['', [Validators.required, Validators.minLength(10)]],
      serviceId: ['', [Validators.required, Validators.minLength(1)]],
      dateStart: ['', [Validators.required, Validators.minLength(10)]],
      dateEnd: ['', [Validators.required, Validators.minLength(10)]],
      timeStart: ['', [Validators.required]],
      timeEnd: ['', [Validators.required]]
    });
  }

  get getControl() {

    return this.reportForm.controls;
  }

}
