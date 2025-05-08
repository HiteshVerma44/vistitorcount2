// src/app/google-analytics.service.ts
import { Injectable } from '@angular/core';

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  // Send a page view event
  public sendPageView(url: string): void {
    gtag('config', 'G-VR8WB2K0WX', {
      page_path: url
    });
  }

  // You can add more methods for other events if needed
}
