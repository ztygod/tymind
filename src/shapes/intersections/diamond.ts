import { Node } from '../../core/node';
import { AnchorPoint, DiamondNodeData } from '../../type';
import { IntersectionCalculator } from './base';

export class DiamondIntersections extends IntersectionCalculator<Node<DiamondNodeData>> {
  protected getIntersection(
    parentNode: Node<DiamondNodeData>,
    childNode: Node<DiamondNodeData>
  ): AnchorPoint {
    const parentCenter = this._getCenterPoint(parentNode);
    const childCenter = this._getCenterPoint(childNode);

    const dx = childCenter.x - parentCenter.x;
    const dy = childCenter.y - parentCenter.y;

    const { width, height } = parentNode.size!;
    const a = width / 2;
    const b = height / 2;

    if (Math.abs(dx) < this.EPS && Math.abs(dy) < this.EPS) {
      return parentCenter;
    }

    // Rhombus standard equation:
    // |x/a| + |y/b| = 1
    // 代入 x = t*dx, y = t*dy
    // => |t*dx/a| + |t*dy/b| = 1
    // => t * (|dx|/a + |dy|/b) = 1
    // => t = 1 / (|dx|/a + |dy|/b)
    const t = 1 / (Math.abs(dx) / a + Math.abs(dy) / b);

    const x = parentCenter.x + dx * t;
    const y = parentCenter.y + dy * t;

    return { x, y };
  }
}
