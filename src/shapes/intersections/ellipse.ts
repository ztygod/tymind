import { Node } from '../../core/node';
import { AnchorPoint, EllipseNodeData } from '../../type';
import { IntersectionCalculator } from './base';

export class Ellipse extends IntersectionCalculator<Node<EllipseNodeData>> {
  protected getIntersection(
    parentNode: Node<EllipseNodeData>,
    childNode: Node<EllipseNodeData>
  ): AnchorPoint {
    const parentCenter = this._getCenterPoint(parentNode);
    const childCenter = this._getCenterPoint(childNode);

    const dx = childCenter.x - parentCenter.x;
    const dy = childCenter.y - parentCenter.y;

    const rx = parentNode.size!.rx;
    const ry = parentNode.size!.ry;

    if (Math.abs(dx) < this.EPS && Math.abs(dy) < this.EPS) {
      return { x: parentCenter.x, y: parentCenter.y };
    }

    const t = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry));

    return {
      x: parentCenter.x + t * dx,
      y: parentCenter.y + t * dy,
    };
  }
}
