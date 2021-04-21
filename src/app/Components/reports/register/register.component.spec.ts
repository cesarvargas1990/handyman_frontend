import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let div: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, NgbModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    div = fixture.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('titulo del componente', () => {
    expect(div.textContent).toContain(component.title);
  });

  it('formulario sin diligenciar', () => {
    expect(component.reportForm.valid).toBeFalsy();
  });

  it('numero de identificacion tecnico sin ningun valor', () => {
    let employeeDocumentNumber = component.reportForm.controls['employeeDocumentNumber'];
    expect(employeeDocumentNumber.valid).toBeFalsy();
  });

  it('numero de identificacion con valor valido' , () => {
    let employeeDocumentNumber = component.reportForm.controls['employeeDocumentNumber'];
    let errors = {};
    errors = employeeDocumentNumber.errors || {};
    employeeDocumentNumber.setValue("1112880062");
    expect(errors['minlength']).toBeFalsy(); 
  })

  it('numero de identificacion con valor invalido' , () => {
    let employeeDocumentNumber = component.reportForm.controls['employeeDocumentNumber'];
    let errors = {};
    employeeDocumentNumber.setValue("123");
    errors = employeeDocumentNumber.errors || {};
    
    expect(errors['minlength']).toBeTruthy(); 
  })

  it('codigo del servicio sin ningun valor', () => {
    let employeeDocumentNumber = component.reportForm.controls['serviceId'];
    expect(employeeDocumentNumber.valid).toBeFalsy(); 
  });

  it('fecha fecha de inicio mayor que fecha final' , () => {
      let startDate = new Date(2021,4,30);
      let endDate = new Date(2021,3,1);
      expect(component.validateDates(startDate,endDate)).toBeFalsy();
  } )

  it('fecha fecha de inicio menor que fecha final' , () => {
    let startDate = new Date(2021,3,30);
    let endDate = new Date(2021,4,1);
    expect(component.validateDates(startDate,endDate)).toBeTruthy();
} )
});
