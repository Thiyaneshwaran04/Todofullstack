import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:2000/';

  constructor(private http:HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  postData(data:any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post('http://localhost:2000/',{data},{headers});
  }
  getid(id:any){
    return this.http.get(`http://localhost:2000/id/${id}`);
  }
  updatecomplete(id: any) {

    return this.http.put('http://localhost:2000/', { id: id });
  }
  getcomplete(): Observable<any>{
    return this.http.get('http://localhost:2000/complete')
  }
  getterminate(): Observable<any>{
    return this.http.get('http://localhost:2000/terminate')
  }
  updateStatus(id: string, status: string): Observable<any> {
   
    return this.http.put('http://localhost:2000/terminate',{id,status})
  }
  renewterminate(id: string,time:string, status: string){
    return this.http.put('http://localhost:2000/terminate/renew',{id,time,status})
  }
  delete(id:any){
    return this.http.delete(`http://localhost:2000/terminate/${id}`,)
  }
}
