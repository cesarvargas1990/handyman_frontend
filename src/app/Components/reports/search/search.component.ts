import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchService } from '../../../Services/reports/search/search.service';
import WeekUtils from "week-utils";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  heading = 'Consultar reporte de servicio';
  subheading = 'Ingrese los datos correspondientes para consultar el calculo de horas.';
  icon = 'pe-7s-bandaid icon-gradient bg-amy-crisp';

  normalHoursTotal = 0;
  nightHoursTotal = 0;
  sundayHoursTotal = 0;
  normalHoursTotalExtra = 0;
  nightHoursTotalExtra = 0;
  sundayHoursTotalExtra = 0;

  searchForm = new FormGroup({
  });

  constructor(private formBuilder: FormBuilder, private searchService: SearchService) { }

  ngOnInit(): void {
    this.createForm();
  }


  createForm() {
    this.searchForm = this.formBuilder.group({
      employeeDocumentNumber: ['', [Validators.required, Validators.minLength(10)]],
      weekNumber: ['', [Validators.required, Validators.minLength(1)]],

    });
  }



  get getControl() {

    return this.searchForm.controls;
  }

  search() {
    let data = {
      'employeeDocumentNumber': this.searchForm.value['employeeDocumentNumber']
    }
    this.searchService.findByEmployeeDocumentNumber(data).subscribe(
      response => {



        this.normalHoursTotal = 0;
        this.nightHoursTotal = 0;
        this.sundayHoursTotal = 0;
        this.normalHoursTotalExtra = 0;
        this.nightHoursTotalExtra = 0;
        this.sundayHoursTotalExtra = 0;

        let normalHours = 0;
        let nightHours = 0;
        let sundayHours = 0;
        let normalHoursExtra = 0;
        let nightHoursExtra = 0;
        let sundayHoursExtra = 0;
        let content = response['content'];
        content.forEach(element => {
          const weekUtils = new WeekUtils();

          const serviceStartDate = element.serviceDateStart.value;
          const serviceEndDate = element.serviceDateEnd.value;

          const startDate = new Date(parseInt(serviceStartDate));
          const endDate = new Date(parseInt(serviceEndDate));

          console.log (  startDate.getDate() + '/' + (startDate.getMonth() - 1)  + '/' + startDate.getUTCFullYear() + ' ' + startDate.getHours() + ':' + startDate.getMinutes()     + ' || ' +  endDate.getDate() + '/' + (endDate.getMonth() - 1)  + '/' + endDate.getUTCFullYear() + ' ' + endDate.getHours() + ':' + endDate.getMinutes())   ;

          const weekNumber = weekUtils.curWeek(startDate);



          if (weekNumber == this.searchForm.value['weekNumber']) {


            if (startDate.getHours() >= 7 && endDate.getHours() <= 20 && endDate.getDay() >= 0 && endDate.getDay() <= 6) {


              normalHours = normalHours + ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);
              this.normalHoursTotal = normalHours;
            }

            if (startDate.getHours() >= 20 && endDate.getHours() <= 7 && endDate.getDay() >= 0 && endDate.getDay() <= 6) {

              console.log ('aqui');
              nightHours = nightHours + ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);
              this.nightHoursTotal = nightHours;
            }

            if (endDate.getDay() == 0) {
              sundayHours = sundayHours + ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);
              this.sundayHoursTotal = sundayHours;

            }

            if (startDate.getHours() >= 7 && endDate.getHours() <= 20 && endDate.getDay() >= 0 && endDate.getDay() <= 6 && this.normalHoursTotal > 48) {


              normalHoursExtra = normalHoursExtra + ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);
              this.normalHoursTotalExtra = normalHoursExtra;
            }

            if (startDate.getHours() >= 20 && endDate.getHours() <= 7 && endDate.getDay() >= 0 && endDate.getDay() <= 6 && this.normalHoursTotal > 48) {


              nightHoursExtra = nightHoursExtra + ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);
              this.nightHoursTotalExtra = nightHoursExtra;
            }

            if (endDate.getDay() == 0) {
              sundayHoursExtra = sundayHoursExtra + ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);
              this.sundayHoursTotalExtra = sundayHoursExtra;

            }
          }


        }
        );

      }, error => {
        console.log(error)
      }
    )

  }


}
