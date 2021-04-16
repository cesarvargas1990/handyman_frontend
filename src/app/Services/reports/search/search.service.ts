import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { 
    
    
  }

  findByEmployeeDocumentNumber(data: any): Observable<any> {
    return this.http.get(environment.baseUrl+'/search/findByEmployeeDocumentNumber?employeeDocumentNumber='+data.employeeDocumentNumber);
  }
}
