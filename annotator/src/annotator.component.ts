import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Director, Shape, Polygon, Rectangle, Circle, Ellipse, Dot, Shortcut, ActType, Util } from 'image-labeling'

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
  @Output() onAdded = new EventEmitter<Shape>();
  @Output() onEdited = new EventEmitter<Shape>();
  @Output() onSelected = new EventEmitter<Shape>();
  @Output() onContextMenu = new EventEmitter<Shape>();
  @Input() imageUrl?: string;
  @Input() shapes?: Shape[] | any[];
  @Input() naturalSize?: boolean;
  @Input() width?: number;
  @Input() height?: number;
  @Input() discRadius?: number;
  @Input() hideBorder?: boolean;
  @Input() shortcut?: Shortcut;

  constructor(private elRef:ElementRef) {}
  ngAfterViewInit() {
    if (this.imageUrl) this.onload();
  }

  onload() {
    let svg = this.getWrapper(), container = this.getContainer(), imageUrl = this.imageUrl!;
    let onloaded = (ev: Event) => {
      if (!ev?.currentTarget || !svg.innerHTML) return;
      let target = (ev!.detail?.testTarget || ev!.currentTarget) as SVGImageElement, 
        src1 = container.getAttribute('data-img')!, src2 = imageUrl;
      if (src1 !== Util.fileName(src2)) {
        for (let i = 0; i < svg.children.length; i++) {
          let child = svg.children[i], href = Util.fileName(child.getAttribute('href'));
          if (href && src1 !== href) child.remove();
        }
        return;
      }
      let bb = target.getBBox();
      let naturalWidth = bb.width, naturalHeight = bb.height, maxWidth = this.width, maxHeight = this.height, ratio = 1;
      svg.addClass('il-svg');
      Object.assign(container.style, {
        width: (this.width || naturalWidth) + 'px',
        height: (this.height || naturalHeight) + 'px',
        overflow: 'hidden',
        backgroundColor: '#e6e6e6'
      });
      if (!this.naturalSize) {
        if (!maxWidth) maxWidth = container.scrollWidth;
        if (!maxHeight) maxHeight = container.scrollHeight;
        if (maxWidth! / maxHeight! > bb.width / bb.height)
          ratio = Math.min(maxHeight!, bb.height) / naturalHeight;
        else ratio = Math.min(maxWidth!, bb.width) / naturalWidth;
      }
      target.size('100%', '100%');
      
      let statics = { 
        width: naturalWidth, 
        height: naturalHeight, 
        ratio, 
        discRadius: this.discRadius || 5, 
        hb: this.hideBorder,
        shortcut: this.shortcut
      }

      Director.init(svg, statics, container);
      this.drawShapes(this.shapes);
      // props.setHandles({ ...getHandles(), container });
      //props.onReady?.({ ...getHandles(), container });
    }
    container.setAttribute('data-img', Util.fileName(imageUrl))
    var image = svg.image(imageUrl, onloaded).size('', '').attr('onmousedown', 'return false').attr('oncontextmenu', 'return false');
    image.addEventListener('testEvent', onloaded)
  }

  drawShapes(shapes?: Shape[] | any[]) {
    let director = this.getDirector();
    if (!shapes) return;
    let rectangles = shapes.filter(s => s instanceof Rectangle || s.type === 'rectangle')
      .map(s => new Rectangle([...s.points], s.categories, s.color));
    let polygons = shapes.filter(s => s instanceof Polygon || s.type === 'polygon')
      .map(s => new Polygon([...s.points], s.categories, s.color));
    let circles = shapes.filter(s => s instanceof Circle || s.type === 'circle')
      .map(s => new Circle(s.centre, s.radius, s.categories, s.color));
    let ellipses = shapes.filter(s => s instanceof Ellipse || s.type === 'ellipse')
      .map(s => new Ellipse(s.centre, s.radiusX, s.radiusY, s.categories, s.phi || 0, s.color));
    let dots = shapes.filter(s => s instanceof Dot || s.type === 'dot')
      .map(s => new Dot(s.position, s.categories, s.color));
    if (rectangles.length > 0) director.plot(rectangles);
    if (polygons.length > 0) director.plot(polygons);
    if (circles.length > 0) director.plot(circles);
    if (ellipses.length > 0) director.plot(ellipses);
    if (dots.length > 0) director.plot(dots);
  }

  getWrapper() {
    return this.elRef.nativeElement.querySelector('svg') as SVGSVGElement;
  }

  getContainer() {
    return this.elRef.nativeElement.querySelector('svg').parentElement! as HTMLDivElement;
  }
}
