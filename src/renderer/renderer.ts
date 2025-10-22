import type {
  DotGridConfig,
  DoubleMeshConfig,
  GraphOptions,
  GridConfig,
  MeshGridConfig,
  NodeData,
  NodeShape,
  NodeStyle,
  ShapeSize,
} from '../type';
import type { Edge } from '../core/edge';
import { Node } from '../core/node';
import { BaseConnector } from './connector';
import { StraightRouter } from './routers/straight-route';
import { BezierRouter } from './routers/bezier-router';

export class Renderer {
  private svgRoot: SVGSVGElement;
  private mainLayer: SVGGElement;
  private connector: BaseConnector;
  private router: {
    straight: StraightRouter;
    bezier: BezierRouter;
  };

  constructor(container: HTMLDivElement, options: Required<GraphOptions>) {
    const { width, height, grid, background } = options;

    this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.mainLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    this.connector = new BaseConnector();
    this.router = {
      straight: new StraightRouter(),
      bezier: new BezierRouter(),
    };

    this.svgRoot.appendChild(this.mainLayer);
    container.appendChild(this.svgRoot);

    // Draw Handling
    this.setSize(width, height);
    this.setBackground(background);

    if (grid) {
      this.drawGrid(grid);
    }
  }

  public setSize(width: number, height: number) {
    this.svgRoot.setAttribute('width', String(width));
    this.svgRoot.setAttribute('height', String(height));
  }

  public setBackground(color: string): void {
    this.svgRoot.style.backgroundColor = color;
  }

  public removeElement(element: SVGGElement): void {}

  public drawGrid(grid: boolean | GridConfig): void {
    if (typeof grid === 'boolean') {
      if (!grid) return;
      grid = {
        type: 'dot',
        gridSize: 10,
        dotColor: 'rgb(170,170,170)',
        dotThickness: 1.0,
      };
    }

    // Basic default configuration
    const defaultConfig: Record<GridConfig['type'], GridConfig> = {
      dot: {
        type: 'dot',
        gridSize: 10,
        dotColor: 'rgb(170,170,170)',
        dotThickness: 1.0,
      },
      mesh: {
        type: 'mesh',
        gridSize: 10,
        meshColor: 'rgb(170,170,170)',
        meshThickness: 1.0,
      },
      'double-mesh': {
        type: 'double-mesh',
        gridSize: 10,
        thinLineColor: 'rgb(170,170,170)',
        thinLineWidth: 1.0,
        boldLineColor: 'rgb(136,136,136)',
        boldLineWidth: 3.0,
        boldLineInterval: 4,
      },
    };

    // Merge user-provided configuration with default configuration
    const mergedGrid = {
      ...defaultConfig[grid.type],
      ...grid,
    } as GridConfig;

    // Draw grid
    switch (mergedGrid.type) {
      case 'dot':
        this.drawDotPattern(mergedGrid);
        break;
      case 'mesh':
        this.drawMeshPattern(mergedGrid);
        break;
      case 'double-mesh':
        this.drawDoubleMeshPattern(mergedGrid);
        break;
      default:
        break;
    }
  }

  public drawNode<T extends NodeData>(node: Node<T>): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'graph-node');

    const { label, shape = 'rect', size, position, style } = node;
    const { x = 0, y = 0 } = position ?? { x: 0, y: 0 };

    const shapeEl = this.createShape(
      shape as NonNullable<T['shape']>,
      size as ShapeSize<NonNullable<T['shape']>>,
      style
    );
    const textEl = this.createText(
      label,
      shape as NonNullable<T['shape']>,
      size as ShapeSize<NonNullable<T['shape']>>,
      style
    );

    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.setAttribute('transform', `translate(${x}, ${y})`);
    wrapper.appendChild(shapeEl);
    wrapper.appendChild(textEl);

    g.appendChild(wrapper);
    this.mainLayer.appendChild(g);

    return g;
  }

  public drawEdge(edge: Edge, direction: 'LR' | 'RL'): SVGGElement {
    console.log('begin');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', edge.id);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `path-${edge.id}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', edge.color || '#a0a0a0');
    path.setAttribute('stroke-width', String(edge.width || 1));

    g.appendChild(path);

    this.mainLayer.insertBefore(g, this.mainLayer.firstChild);
    this.updateEdgePath(g, edge, direction);

    return g;
  }

  /**  Update Node Position */
  public updateNodePosition(element: SVGGElement, x: number, y: number): void {}

  /** Update Edge Position */
  public updateEdgePath(element: SVGGElement, edge: Edge, direction: 'RL' | 'LR'): void {
    const pathEl = element.querySelector(`#path-${edge.id}`);
    if (!pathEl) return;

    const routerType = edge.type || 'bezier';
    const router = this.router[routerType];

    if (!router) {
      console.error(`Router type "${routerType}" not found for edge ${edge.id}`);
      return;
    }

    const { sourcePoint, targetPoint } = this.connector.getEdgesEndPoints(
      edge.source,
      edge.target,
      direction
    );

    const pathD = router.getPathD(sourcePoint, targetPoint);
    pathEl.setAttribute('d', pathD);
  }

  /** Draw dot-style grid */
  private drawDotPattern(config: DotGridConfig): void {
    const { gridSize, dotColor, dotThickness } = config;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    const patternId = `dot-pattern-${Date.now()}`;

    pattern.setAttribute('id', patternId);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', String(gridSize));
    pattern.setAttribute('height', String(gridSize));

    circle.setAttribute('cx', String(gridSize! / 2));
    circle.setAttribute('cy', String(gridSize! / 2));
    circle.setAttribute('r', String(dotThickness));
    circle.setAttribute('fill', dotColor!);

    pattern.appendChild(circle);
    defs.appendChild(pattern);
    this.svgRoot.appendChild(defs);

    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', `url(#${patternId})`);

    // insert at the bottom of the main layer
    this.svgRoot.insertBefore(rect, this.mainLayer);
  }

  /** Draw mesh-style grid */
  private drawMeshPattern(config: MeshGridConfig): void {
    const { gridSize, meshColor, meshThickness } = config;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    const patternId = `mesh-pattern-${Date.now()}`;

    pattern.setAttribute('id', patternId);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', String(gridSize));
    pattern.setAttribute('height', String(gridSize));

    // Create a horizontal line
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', '0');
    hLine.setAttribute('y1', '0');
    hLine.setAttribute('x2', String(gridSize));
    hLine.setAttribute('y2', '0');
    hLine.setAttribute('stroke', meshColor!);
    hLine.setAttribute('stroke-width', String(meshThickness));

    // Create a vertical line
    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', '0');
    vLine.setAttribute('y1', '0');
    vLine.setAttribute('x2', '0');
    vLine.setAttribute('y2', String(gridSize));
    vLine.setAttribute('stroke', meshColor!);
    vLine.setAttribute('stroke-width', String(meshThickness));

    pattern.appendChild(hLine);
    pattern.appendChild(vLine);
    defs.appendChild(pattern);
    this.svgRoot.appendChild(defs);

    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', `url(#${patternId})`);

    // insert at the bottom of the main layer
    this.svgRoot.insertBefore(rect, this.mainLayer);
  }

  /** Draw double-mesh-style grid*/
  private drawDoubleMeshPattern(config: DoubleMeshConfig): void {
    const {
      gridSize,
      thinLineColor,
      thinLineWidth,
      boldLineColor,
      boldLineWidth,
      boldLineInterval,
    } = config;

    if (!gridSize || !boldLineInterval || !thinLineColor || !boldLineColor) return;

    const totalSize = gridSize * boldLineInterval;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    const patternId = `double-mesh-pattern-${Date.now()}`;

    pattern.setAttribute('id', patternId);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', String(totalSize));
    pattern.setAttribute('height', String(totalSize));

    // Draw thin lines and thick lines
    for (let i = 0; i <= boldLineInterval; i++) {
      const pos = i * gridSize;

      // thin lines
      if (i < boldLineInterval) {
        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', '0');
        hLine.setAttribute('y1', String(pos));
        hLine.setAttribute('x2', String(totalSize));
        hLine.setAttribute('y2', String(pos));
        hLine.setAttribute('stroke', thinLineColor);
        hLine.setAttribute('stroke-width', String(thinLineWidth));
        pattern.appendChild(hLine);

        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', String(pos));
        vLine.setAttribute('y1', '0');
        vLine.setAttribute('x2', String(pos));
        vLine.setAttribute('y2', String(totalSize));
        vLine.setAttribute('stroke', thinLineColor);
        vLine.setAttribute('stroke-width', String(thinLineWidth));
        pattern.appendChild(vLine);
      }

      // thick lines
      if (i === boldLineInterval) {
        const hBold = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hBold.setAttribute('x1', '0');
        hBold.setAttribute('y1', String(pos));
        hBold.setAttribute('x2', String(totalSize));
        hBold.setAttribute('y2', String(pos));
        hBold.setAttribute('stroke', boldLineColor);
        hBold.setAttribute('stroke-width', String(boldLineWidth));
        pattern.appendChild(hBold);

        const vBold = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vBold.setAttribute('x1', String(pos));
        vBold.setAttribute('y1', '0');
        vBold.setAttribute('x2', String(pos));
        vBold.setAttribute('y2', String(totalSize));
        vBold.setAttribute('stroke', boldLineColor);
        vBold.setAttribute('stroke-width', String(boldLineWidth));
        pattern.appendChild(vBold);
      }
    }

    defs.appendChild(pattern);
    this.svgRoot.appendChild(defs);

    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', `url(#${patternId})`);

    // insert at the bottom of the main layer
    this.svgRoot.insertBefore(rect, this.mainLayer);
  }

  private createShape<S extends NodeShape>(
    shape: S,
    size: ShapeSize<S>,
    style?: NodeStyle
  ): SVGElement {
    return this.shapeRenderers[shape](size, style);
  }

  private createText<S extends NodeShape>(
    label: string,
    shape: S,
    size: ShapeSize<S>,
    style?: NodeStyle
  ): SVGTextElement {
    const ns = 'http://www.w3.org/2000/svg';
    const textEl = document.createElementNS(ns, 'text');
    textEl.textContent = label ?? '';

    const fontSize = style?.fontSize ?? 14;
    const fontColor = style?.fontColor ?? '#333';

    // 计算中心点
    const { x, y } = this.getTextCenter[shape](size, fontSize);

    textEl.setAttribute('x', String(x));
    textEl.setAttribute('y', String(y));
    textEl.setAttribute('text-anchor', 'middle');
    textEl.setAttribute('font-size', String(fontSize));
    textEl.setAttribute('fill', fontColor);
    textEl.setAttribute('dominant-baseline', 'middle');
    textEl.setAttribute('pointer-events', 'none');

    return textEl;
  }

  private shapeRenderers: {
    [S in NodeShape]: (size: ShapeSize<S>, style?: NodeStyle) => SVGElement;
  } = {
    rect: (size, style) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', String(size.width));
      rect.setAttribute('height', String(size.height));
      rect.setAttribute('rx', '6');
      rect.setAttribute('ry', '6');
      this.applyStyle(rect, style);
      return rect;
    },
    circle: (size, style) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', String(size.radius));
      circle.setAttribute('cx', String(size.radius));
      circle.setAttribute('cy', String(size.radius));
      this.applyStyle(circle, style);
      return circle;
    },
    diamond: (size, style) => {
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points = [
        `${size.width / 2},0`,
        `${size.width},${size.height / 2}`,
        `${size.width / 2},${size.height}`,
        `0,${size.height / 2}`,
      ].join(' ');
      poly.setAttribute('points', points);
      this.applyStyle(poly, style);
      return poly;
    },
    ellipse: (size, style) => {
      const ell = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ell.setAttribute('cx', String(size.rx));
      ell.setAttribute('cy', String(size.ry));
      ell.setAttribute('rx', String(size.rx));
      ell.setAttribute('ry', String(size.ry));
      this.applyStyle(ell, style);
      return ell;
    },
  };

  private applyStyle(el: SVGElement, style?: NodeStyle) {
    el.setAttribute('fill', style?.background ?? '#fff');
    el.setAttribute('stroke', style?.borderColor ?? '#666');
    el.setAttribute('stroke-width', String(style?.borderWidth ?? 1.5));
  }

  private getTextCenter: {
    [S in NodeShape]: (size: ShapeSize<S>, fontSize: number) => { x: number; y: number };
  } = {
    rect: (size, fontSize) => ({
      x: size.width / 2,
      y: size.height / 2 + fontSize / 3,
    }),
    diamond: (size, fontSize) => ({
      x: size.width / 2,
      y: size.height / 2 + fontSize / 3,
    }),
    circle: (size, fontSize) => ({
      x: size.radius,
      y: size.radius + fontSize / 3,
    }),
    ellipse: (size, fontSize) => ({
      x: size.rx,
      y: size.ry + fontSize / 3,
    }),
  };
}
