import type { EdgeArrow, EdgeLabelStyle, EdgeStyle, EdgeType, EdgeData } from '../type';
import type { Node } from './node';
import type { Renderer } from '../renderer/renderer';

export class Edge {
  readonly id: string;
  readonly source: Node;
  readonly target: Node;
  readonly direction: 'LR' | 'RL';
  type?: EdgeType;
  color?: string;
  width?: number;
  style?: EdgeStyle;
  arrow?: EdgeArrow;
  label?: string;
  labelStyle?: EdgeLabelStyle;
  data?: Record<string, any>;

  private _renderer: Renderer;
  private _element: SVGGElement | null = null;

  constructor(
    data: { id: string; source: Node; target: Node; direction: 'LR' | 'RL' } & Partial<
      Omit<EdgeData, 'id' | 'source' | 'target'>
    >,
    renderer: Renderer
  ) {
    this.id = data.id;
    this.source = data.source;
    this.target = data.target;
    this.direction = data.direction;
    this._renderer = renderer;

    Object.assign(this, data);

    this.source.addOutgoingEdge(this);
    this.target.addIncomingEdge(this);
  }

  /** Command the Renderer to draw itself */
  public draw(): void {
    this._element = this._renderer.drawEdge(this, this.direction);
  }

  /** Update Edge Layout */
  public update(): void {
    if (this._element) {
      this._renderer.updateEdgePath(this._element, this, this.direction);
    }
  }

  /** Destroy itself */
  public destroy(): void {
    if (this._element) {
      this._renderer.removeElement(this._element);
    }
    this.source.removeOutgoingEdge(this);
    this.target.removeIncomingEdge(this);
  }
}
