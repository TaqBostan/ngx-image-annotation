const ns = "http://www.w3.org/2000/svg";

interface Event { detail: any }
interface SVGSVGElement {
    circle(r: number): SVGCircleElement;
    ellipse(rx: number, ry: number): SVGEllipseElement;
    rect(w: number, h: number): SVGRectElement;
    polyline(points: [number, number][]): SVGPolylineElement;
    plain(text: string): SVGTextElement;
    path(d: string): SVGPathElement;
    image(url: string, onload: (ev: Event) => any): SVGImageElement;
    size(w: number, h: number): void;
}

interface SVGElement {
    events: {event: string, cb: EventListener}[];
    fill(color: string): this;
    move(x: number, y: number): this;
    addClass(name: string): this;
    removeClass(name: string): this;
    stroke(obj: { color?: string, width?: number, opacity?: number, dasharray?: string }): this;
    attr(name: string, value: string): this;
    increment(d: [x: number, y: number]): void;
    mouseup(cb: (ev: MouseEvent) => any): this;
    mousedown(cb: (ev: MouseEvent) => any): this;
    mousemove(cb: (ev: MouseEvent) => any): this;
    mouseover(cb: (ev: MouseEvent) => any): this;
    mouseout(cb: (ev: MouseEvent) => any): this;
    click(cb: (ev: MouseEvent) => any): this;
    dblclick(cb: (ev: MouseEvent) => any): this;
    on(event: string, cb: (ev: MouseEvent) => any): this;
    off(event: string): this;
    opacity(o: number): this;
}

interface SVGPolylineElement {
    array(): [number, number][];
    plot(points: [number, number][]): void;
}

interface SVGPathElement {
    plot(d: string): void;
}

interface SVGRectElement {
    radius(r: number): SVGRectElement;
}

interface SVGEllipseElement {
    radius(rx: number, ry: number): this;
}

interface SVGCircleElement {
    radius(r: number): this;
    x(x: number): this;
    x(): number;
    y(y: number): this;
    y(): number;
}

interface SVGEllipseElement {
    x(x: number): this;
    x(): number;
    y(y: number): this;
    y(): number;
}

interface SVGTextElement {
    font(size: number, weight: string, fill?: string, anchor?: string): SVGTextElement;
}

interface SVGImageElement {
    size(w: string, h: string): this;
}