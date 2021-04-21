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
  title = 'Consulta del servicio';

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
      weekNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern(/^-?(0|[1-9]\d*)?$/) ]],

    });
  }


  get getControl() {

    return this.searchForm.controls;
  }

  search() {
    let data = {
      'employeeDocumentNumber': this.searchForm.value['employeeDocumentNumber'],
      'weekendNumber': this.searchForm.value['weekNumber']
    }

    this.searchService.searchByWeekAndIdentify(data).subscribe(

      response => {


        this.normalHoursTotal = response.normalHoursTotal;
        this.nightHoursTotal = response.nightHoursTotal;
        this.sundayHoursTotal = response.sundayHoursTotal;
        this.normalHoursTotalExtra = response.normalHoursTotalExtra;
        this.nightHoursTotalExtra = response.nightHoursTotalExtra;
        this.sundayHoursTotalExtra = response.sundayHoursTotalExtra;
      }
    )



  }


}
