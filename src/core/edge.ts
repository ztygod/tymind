import type { EdgeArrow, EdgeLabelStyle, EdgeStyle, EdgeType, EdgeData } from '../type';
import type { Node } from './node';
import type { Renderer } from '../renderer/renderer';

export class Edge {
  readonly id: string;
  readonly source: Node;
  readonly target: Node;
  readonly direction: 'LR' | 'RL' | 'TB' | 'BT';
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
  private _tree_both_direction: 'both-right' | 'both-left' | null = null;

  constructor(
    data: {
      id: string;
      source: Node;
      target: Node;
      direction: 'LR' | 'RL' | 'TB' | 'BT';
    } & Partial<Omit<EdgeData, 'id' | 'source' | 'target'>>,
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
    this._element = this._renderer.drawEdge(this, this.direction, this._tree_both_direction);
  }

  /** 
   * 当布局选择树型布局，且采用左右方向时，根据布局设置私有属性，如下
   * layoutOptions: {
   *  layoutType: 'tree',
   *  treeType: 'both',
   *  direction: 'TB',
   *  nodeVerticalGap: 10,
    },
  */
  public setTreeInBothDirection(direction: 'both-left' | 'both-right') {
    this._tree_both_direction = direction;
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
