import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnotatorComponent } from "../annotator/src/annotator.component";

@Component({
  selector: 'app-demo',
  imports: [RouterOutlet, AnnotatorComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class AppComponent {
  title = 'demo';
}
