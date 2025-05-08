// visitor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor(private http: HttpClient) { }

  // Fetch total visitors from the backend
  getTotalVisitors(): Observable<{ totalVisitors: number }> {
    return this.http.get<{ totalVisitors: number }>('http://localhost:3000/api/total-visitors');
  }
}
