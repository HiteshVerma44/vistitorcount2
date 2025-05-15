// visitor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  constructor(private http: HttpClient) {}

  // Fetch total visitors from the backend
  // getTotalVisitors(): Observable<{ pageViews: number }> {
  //   return this.http.get<{ pageViews: number }>(
  //     'http://localhost:3000/api/total-visitors'
  //   );
  // }

  getTotalVisitors(): Observable<any> {
    const headers = new HttpHeaders({
      appServiceKey:
        'cC/$z5E0qi4!VHIszp2&!.g/7a3Af#568yh$?.rj$H#21zIVQLfAQO?#G$2',
    });

    return this.http.get<any>(
      'https://wsstest.pspcl.in/servicebe/ex/totalVisitors',
      { headers }
    );
  }
}
