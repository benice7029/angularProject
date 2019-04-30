import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { dbmModel } from '../model/dbmModel';
import { AddDashboardManagementData } from '../model/AddDashboardManagementData';

@Injectable({
  providedIn: 'root'
})
export class DashboardManageService {


  
  constructor(private http: HttpClient) { }

  getExistedFolders() : Observable<any> {

    return this.http.get('http://localhost:8080/api/dashboardManagement/search/allfolders') ;

  }

  getDashboardManageData(id): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let params = new HttpParams().set("id", id);

    console.log('http get ')

    let res: Observable<any> = this.http.get('http://localhost:8080/api/dashboardManagement/search/folder', { headers: headers, params: params });

    console.log(res)
    
    return this.http.get('http://localhost:8080/api/dashboardManagement/search/folder', { headers: headers, params: params })
    
  }

  searchByKeyword(keyword: string) : Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let params = new HttpParams().set("keyWord", keyword);

    return this.http.get('http://localhost:8080/api/dashboardManagement/search/searchingByKeyword', { headers: headers, params: params }) ;
    
  }


  moveDashboardManageData(targetId: string, updateData: Array<dbmModel>): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let params = new HttpParams().set("targetId", targetId);

    console.log('http post ')

    
    return this.http.post('http://localhost:8080/api/dashboardManagement/update/move', updateData, { headers: headers, params: params })
  }

  addDashboardManageData(addData: AddDashboardManagementData): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log('http post add')

    return this.http.post('http://localhost:8080/api/dashboardManagement/update/add', addData, { headers: headers })
  }

  removeDashboardManageData(removeData: Array<dbmModel>): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log('http post delete')

    return this.http.post('http://localhost:8080/api/dashboardManagement/update/delete', removeData, { headers: headers })
  }

}
