import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let div: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ 
      declarations: [ SearchComponent ],   
      imports: [ReactiveFormsModule,HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    div = fixture.nativeElement.querySelector('div');
  });

  it('titulo del componente', () => {
    expect(div.textContent).toContain(component.title);
  });

  it('formulario sin diligenciar', () => {
    expect(component.searchForm.valid).toBeFalsy();
  });

  it('numero de identificacion tecnico sin ningun valor', () => {
    let employeeDocumentNumber = component.searchForm.controls['employeeDocumentNumber'];
    expect(employeeDocumentNumber.valid).toBeFalsy();
  });

  it('numero de identificacion con valor valido' , () => {
    let employeeDocumentNumber = component.searchForm.controls['employeeDocumentNumber'];
    let errors = {};
    errors = employeeDocumentNumber.errors || {};
    employeeDocumentNumber.setValue("1112880062");
    expect(errors['minlength']).toBeFalsy(); 
  })

  it('numero de identificacion con valor invalido' , () => {
    let employeeDocumentNumber = component.searchForm.controls['employeeDocumentNumber'];
    let errors = {};
    employeeDocumentNumber.setValue("123");
    errors = employeeDocumentNumber.errors || {};
    expect(errors['minlength']).toBeTruthy(); 
  })

  it('numero de semana sin ningun valor', () => {
    let weekNumber = component.searchForm.controls['weekNumber'];
    expect(weekNumber.valid).toBeFalsy();
  });

  it('numero de semana con valor invalido' , () => {
    let weekNumber = component.searchForm.controls['weekNumber'];
    let errors = {};
    weekNumber.setValue("111123223");
    errors = weekNumber.errors || {};
    expect(errors['maxlength']).toBeTruthy(); 
  })

  it('numero de semana con valor invalido' , () => {
    let weekNumber = component.searchForm.controls['weekNumber'];
    let errors = {};
    weekNumber.setValue("54");
    errors = weekNumber.errors || {};
    expect(errors['minlength']).toBeFalsy(); 
  })

  it('numero de semana con valor no numerico' , () => {
    let weekNumber = component.searchForm.controls['weekNumber'];
    let errors = {};
    weekNumber.setValue("xxxx");
    errors = weekNumber.errors || {};
    expect(errors['pattern']).toBeTruthy(); 
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
