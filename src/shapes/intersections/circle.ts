import { Node } from '../../core/node';
import { AnchorPoint, CircleNodeData } from '../../type';
import { IntersectionCalculator } from './base';

export class CircleIntersections extends IntersectionCalculator<Node<CircleNodeData>> {
  public getIntersection(parentNode: Node<CircleNodeData>, childNode: Node): AnchorPoint {
    const parentCenter = this._getCenterPoint(parentNode);
    const childCenter = this._getCenterPoint(childNode);

    const dx = childCenter.x - parentCenter.x;
    const dy = childCenter.y - parentCenter.y;

    if (!parentNode.size) {
      throw new Error('parentNode.size is undefined');
    }
    const r = parentNode.size.radius;

    if (Math.abs(dx) < this.EPS && Math.abs(dy) < this.EPS) {
      return { x: parentCenter.x, y: parentCenter.y };
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    const t = r / len;

    return {
      x: parentCenter.x + t * dx,
      y: parentCenter.y + t * dy,
    };
  }
}
