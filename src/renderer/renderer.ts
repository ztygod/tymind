import type {
  DotGridConfig,
  DoubleMeshConfig,
  GraphOptions,
  GridConfig,
  MeshGridConfig,
  NodeShape,
  NodeStyle,
} from '../type';
import type { Edge } from '../core/edge';
import { Node } from '../core/node';

export class Renderer {
  private svgRoot: SVGSVGElement;
  private mainLayer: SVGGElement;

  constructor(container: HTMLDivElement, options: Required<GraphOptions>) {
    const { width, height, grid, background } = options;

    this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.mainLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

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

  public drawNode(node: Node): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'graph-node');

    const { id, label, shape = 'rect', size, position, style } = node;
    const { width = 100, height = 40 } = size ?? { width: 100, height: 40 };
    const { x = 0, y = 0 } = position ?? { x: 0, y: 0 };

    // Create shape and label text
    const shapeEl = this.createShape(shape, width, height, style);
    const textEl = this.createText(label, width, height, style);

    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.setAttribute('transform', `translate(${x}, ${y})`);
    wrapper.appendChild(shapeEl);
    wrapper.appendChild(textEl);

    g.appendChild(wrapper);
    this.mainLayer.appendChild(g);

    return g;
  }

  // public drawEdge(edge: Edge): SVGGElement {

  // }

  /**  Update Node Position */
  public updateNodePosition(element: SVGGElement, x: number, y: number): void {}

  /** Update Edge Position */
  public updateEdgePath(element: SVGGElement, edge: Edge): void {}

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

  private createShape(
    shape: NodeShape,
    width: number,
    height: number,
    style?: NodeStyle
  ): SVGElement {
    const ns = 'http://www.w3.org/2000/svg';
    const stroke = style?.borderColor ?? '#666';
    const strokeWidth = style?.borderWidth ?? 1.5;
    const fill = style?.background ?? '#ffffff';

    let shapeEl: SVGElement;

    switch (shape) {
      case 'rect': {
        shapeEl = document.createElementNS(ns, 'rect');
        shapeEl.setAttribute('width', String(width));
        shapeEl.setAttribute('height', String(height));
        shapeEl.setAttribute('rx', '6');
        shapeEl.setAttribute('ry', '6');
        break;
      }
      case 'circle': {
        shapeEl = document.createElementNS(ns, 'circle');
        const r = Math.min(width, height) / 2;
        shapeEl.setAttribute('r', String(r));
        shapeEl.setAttribute('cx', String(r));
        shapeEl.setAttribute('cy', String(r));
        break;
      }
      case 'diamond': {
        shapeEl = document.createElementNS(ns, 'polygon');
        const points = [
          `${width / 2},0`,
          `${width},${height / 2}`,
          `${width / 2},${height}`,
          `0,${height / 2}`,
        ].join(' ');
        shapeEl.setAttribute('points', points);
        break;
      }
      case 'ellipse': {
        shapeEl = document.createElementNS(ns, 'ellipse');
        shapeEl.setAttribute('cx', String(width));
        shapeEl.setAttribute('cy', String(height));
        shapeEl.setAttribute('rx', String(width / 2));
        shapeEl.setAttribute('ry', String(height / 2));
        break;
      }
      default:
        throw new Error(`Unsupported shape: ${shape}`);
    }

    shapeEl.setAttribute('fill', fill);
    shapeEl.setAttribute('stroke', stroke);
    shapeEl.setAttribute('stroke-width', String(strokeWidth));
    return shapeEl;
  }

  private createText(label: string, width: number, height: number, style?: NodeStyle) {
    const ns = 'http://www.w3.org/2000/svg';
    const textEl = document.createElementNS(ns, 'text');
    textEl.textContent = label ?? '';

    const fontSize = style?.fontSize ?? 14;
    const fontColor = style?.fontColor ?? '#333';

    textEl.setAttribute('x', String(width / 2));
    textEl.setAttribute('y', String(height / 2 + fontSize / 3));
    textEl.setAttribute('text-anchor', 'middle');
    textEl.setAttribute('font-size', String(fontSize));
    textEl.setAttribute('fill', fontColor);
    textEl.setAttribute('dominant-baseline', 'middle');
    textEl.setAttribute('pointer-events', 'none');

    return textEl;
  }
}
