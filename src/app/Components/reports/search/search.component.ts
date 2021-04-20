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


  normalHoursTotalJ = 0;
  nightHoursTotalJ = 0;
  sundayHoursTotalJ = 0;
  normalHoursTotalExtraJ = 0;
  nightHoursTotalExtraJ = 0;
  sundayHoursTotalExtraJ = 0;

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

  validateHoursInRange(startDate, endDate, startDatef, endDatef) {
    let isHourInRange = false;
   

    if (startDate.getTime() >= startDatef.getTime() && endDate.getTime() <= endDatef.getTime()



      || (startDate.getTime() <= startDatef.getTime() && endDatef.getTime() >= startDatef.getTime()


        || (endDate.getTime() <= endDatef.getTime() && endDate.getTime() >= endDatef.getTime()))) {

      isHourInRange = true;
    }





    return isHourInRange;

  }

  getTotalHoursDiff(startDate, endDate) {
    return ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);
  }

  get getControl() {

    return this.searchForm.controls;
  }

  search() {
    let data = {
      'employeeDocumentNumber': this.searchForm.value['employeeDocumentNumber'],
      'weekendNumber': this.searchForm.value['weekNumber']
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

          let diff = ((endDate.valueOf() - startDate.valueOf()) / 1000 / 60 / 60);

          const weekNumber = weekUtils.curWeek(startDate);
          if (weekNumber == this.searchForm.value['weekNumber']) {

            for (let x = 0; x < diff; x++) {

              let dti = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours() + x, 0)
              let dtf = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), dti.getHours(), 59)


              if (dti.getHours() >= 7 && dti.getMinutes() >= 0 && dtf.getHours() <= 19 && dtf.getMinutes() <= 59 && dti.getDay() >= 1 && dti.getDay() <= 6) {

                this.normalHoursTotal = this.normalHoursTotal + 1;
              }

              if ((dti.getHours() >= 20 && dti.getMinutes() >= 0) && (dtf.getDay() >= 1 && dtf.getDay() <= 6)) {

                this.nightHoursTotal = this.nightHoursTotal + 1;
              }

              if (dti.getDay() > dtf.getDay() && dtf.getHours() <= 6 && dtf.getMinutes() <= 59) {

                this.nightHoursTotal = this.nightHoursTotal + 1;
              }

              if (dti.getDay() == 0) {

                this.sundayHoursTotal = this.sundayHoursTotal + 1;
              }

            }
          }

          if (this.normalHoursTotal >= 48) {
            this.normalHoursTotalExtra = this.normalHoursTotal - 48;
            this.normalHoursTotal = this.normalHoursTotal - this.normalHoursTotalExtra;
          }

          if (this.nightHoursTotal >= 48) {
            this.nightHoursTotalExtra = this.nightHoursTotal - 48;
            this.nightHoursTotal = this.nightHoursTotal - this.nightHoursTotalExtra;
          }

          if (this.sundayHoursTotal >= 48) {
            this.sundayHoursTotalExtra = this.sundayHoursTotal - 48;
            this.sundayHoursTotal = this.sundayHoursTotal - this.sundayHoursTotalExtra;
          }

        })
      }, error => {
        console.log(error)
      }

    )

    this.searchService.searchByWeekAndIdentify(data).subscribe(

      response => {


        this.normalHoursTotalJ = response.normalHoursTotal;
        this.nightHoursTotalJ = response.nightHoursTotal;
        this.sundayHoursTotalJ = response.sundayHoursTotal;
        this.normalHoursTotalExtraJ = response.normalHoursTotalExtra;
        this.nightHoursTotalExtraJ = response.nightHoursTotalExtra;
        this.sundayHoursTotalExtraJ = response.sundayHoursTotalExtra;
      }
    )



  }


}
