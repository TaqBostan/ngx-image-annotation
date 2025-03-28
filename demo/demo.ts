import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './demo.component';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter([])]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
