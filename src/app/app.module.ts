import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';  // Import DashboardModule
import { HttpClientModule } from '@angular/common/http'; // <-- Import this



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    HttpClientModule  // <-- And add this here

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
