import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnotatorComponent } from "../annotator/src/annotator.component";
import { Circle, Dot, Ellipse, Polygon, Rectangle, Shape } from 'image-labeling';

const img2 = '/ic.png';
const imgUrl = '/Fruit.jpeg';
const categories = ['blueberry', 'strawberry', 'raspberry', 'apple', 'benana'];
let p = new Polygon([[550, 224], [519, 222], [474, 261], [430, 341], [416, 383], [427, 399], [446, 414], [528, 396], [604, 372], [633, 325], [654, 313], [648, 282], [638, 231], [596, 208], [562, 208]], ['strawberry'], "#27fe7640");
let r = new Rectangle([[734, 292], [680, 377], [781, 440], [835, 355]], ['blueberry'], "rgba(255,255,255,0.4)");
let c = new Circle([70, 90], 55, ['blueberry'], "rgba(0,0,0,0.4)");
let e = new Ellipse([457, 114], 40, 80, ['raspberry'], 0, "#0004");
let d = new Dot([123, 223], ['raspberry'], "rgba(0,0,0,0.4)");
@Component({
  selector: 'app-demo',
  imports: [RouterOutlet, AnnotatorComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  title = 'demo';
  img2 = '/ic.png';
  img = imgUrl;
  shapes: Shape[] = [r, p, c, e, d];
}
