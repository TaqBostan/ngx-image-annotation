import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Director, Shape, Polygon, Rectangle, Circle, Ellipse, Dot, Shortcut, ActType, Util, ImageEl, SVGSVGEl } from 'image-labeling'

@Component({
  selector: 'annotator',
  imports: [],
  template: `
    <div>
      <svg>
      </svg>
    </div>
  `,
  styles: ``
})
export class AnnotatorComponent {
  getDirector = () => Director.instance!;
  @Output() onReady = new EventEmitter();
  @Output() onAdded = new EventEmitter<Shape>();
  @Output() onEdited = new EventEmitter<Shape>();
  @Output() onSelected = new EventEmitter<Shape>();
  @Output() onContextMenu = new EventEmitter<Shape>();
  @Input() set imageUrl(value: string) { 
    Director.clear(this.elRef.nativeElement.querySelector('svg'));
    if(value) this.onload(value); 
  }
  @Input() shapes?: Shape[] | any[];
  @Input() naturalSize?: boolean;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() discRadius?: number;
  @Input() hideBorder?: boolean;
  @Input() shortcut?: Shortcut;
  @Input() categoryOpt?: { vertical: 'top' | 'middle' | 'bottom' } | undefined;

  constructor(private elRef:ElementRef) {}
  
  stopAll = () => {
    let director = this.getDirector();
    director.stopDraw();
    director.stopEdit();
  }

  drawRectangle() {
    this.stopAll();
    this.getDirector().startDraw(new Rectangle());
  }

  drawPolygon() {
    this.stopAll();
    this.getDirector().startDraw(new Polygon());
  }

  drawCircle() {
    this.stopAll();
    this.getDirector().startDraw(new Circle());
  }

  drawEllipse() {
    this.stopAll();
    this.getDirector().startDraw(new Ellipse());
  }

  drawDot() {
    this.stopAll();
    this.getDirector().startDraw(new Dot());
  }

  stop = this.stopAll
  stopEdit = () => this.getDirector().stopEdit()
  edit = (id: number) => this.getDirector().edit(id)
  delete = (id: number) => this.getDirector().removeById(id)
  updateCategories = (id: number, categories: string[], color?: string) => this.getDirector().updateCategories(id, categories, color)

  zoom = (factor: number, relative: boolean = true) => {
    let director = this.getDirector();
    factor = director.setSizeAndRatio(factor, relative);
    director.zoom(factor);
  }

  getShapes = () => this.getDirector().getShapes()

  onload(imageUrl: string) {
    let svg = this.getWrapper(), container = this.getContainer();
    let onloaded = (target: ImageEl) => {
      let bb = target.bbox();
      let naturalWidth = bb.width, naturalHeight = bb.height, ratio = 1, sw = container.parentElement?.scrollWidth ?? 0, 
        width = Util.toPx(sw, this.width), height = Util.toPx(sw, this.height);
      svg.addClass('il-svg');
      Object.assign(container.style, {
        width: (width || naturalWidth) + 'px',
        height: (height || naturalHeight) + 'px',
        overflow: 'hidden',
        backgroundColor: '#e6e6e6'
      });
      if (!this.naturalSize) {
        if (!width) width = container.scrollWidth;
        if (!height) height = container.scrollHeight;
        if (width! / height! > bb.width / bb.height)
          ratio = Math.min(height!, bb.height) / naturalHeight;
        else ratio = Math.min(width!, bb.width) / naturalWidth;
      }
      target.size('100%', '100%');
      
      let statics = { 
        width: naturalWidth, 
        height: naturalHeight, 
        ratio, 
        discRadius: this.discRadius || 5, 
        hb: this.hideBorder,
        shortcut: this.shortcut,
        categoryOpt: this.categoryOpt || { vertical: 'top' }
      }

      Director.init(svg, statics, container);
      this.drawShapes(this.shapes);
      this.onReady.emit();

      let actions = [
        { type: ActType.Added, func: (shape: Shape) => this.onAdded.emit(shape) },
        { type: ActType.Edited, func: (shape: Shape) => this.onEdited.emit(shape) },
        { type: ActType.Selected, func: (shape: Shape) => this.onSelected.emit(shape) },
        { type: ActType.CtxMenu, func: (shape: Shape) => this.onContextMenu.emit(shape) }
      ]
      Director.setActions(actions);

    }
    var image = svg.image(imageUrl, onloaded).size('', '').attr('onmousedown', 'return false').attr('oncontextmenu', 'return false');
    image.on('testEvent', (ev: CustomEvent) => onloaded(new ImageEl(ev.detail.testTarget)))
  }

  drawShapes(shapes?: Shape[] | any[]) {
    let director = this.getDirector();
    if (!shapes) return;
    director.setMaxId(Math.max(...shapes.map(c => c.id ?? 0)));
    let rectangles = shapes.filter(s => s instanceof Rectangle || s.type === 'rectangle')
      .map(s => new Rectangle([...s.points], s.categories, s.color, s.id));
    let polygons = shapes.filter(s => s instanceof Polygon || s.type === 'polygon')
      .map(s => new Polygon([...s.points], s.categories, s.color, s.id));
    let circles = shapes.filter(s => s instanceof Circle || s.type === 'circle')
      .map(s => new Circle(s.centre, s.radius, s.categories, s.color, s.id));
    let ellipses = shapes.filter(s => s instanceof Ellipse || s.type === 'ellipse')
      .map(s => new Ellipse(s.centre, s.radiusX, s.radiusY, s.categories, s.phi || 0, s.color, s.id));
    let dots = shapes.filter(s => s instanceof Dot || s.type === 'dot')
      .map(s => new Dot(s.position, s.categories, s.color, s.id));
    if (rectangles.length > 0) director.plot(rectangles);
    if (polygons.length > 0) director.plot(polygons);
    if (circles.length > 0) director.plot(circles);
    if (ellipses.length > 0) director.plot(ellipses);
    if (dots.length > 0) director.plot(dots);
  }

  getWrapper() {
    return new SVGSVGEl(this.elRef.nativeElement.querySelector('svg'));
  }

  getContainer() {
    return this.elRef.nativeElement.querySelector('svg').parentElement! as HTMLDivElement;
  }
}
