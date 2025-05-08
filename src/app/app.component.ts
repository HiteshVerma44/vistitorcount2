import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GoogleAnalyticsService } from './google-analytics.service';
import { VisitorService } from './visitor.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {


  
  totalVisitors: number = 0;






  constructor(
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private visitorService: VisitorService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.googleAnalyticsService.sendPageView(event.urlAfterRedirects);
      });



      this.visitorService.getTotalVisitors().subscribe((data) => {
        this.totalVisitors = data.totalVisitors;
      });
  }
}
