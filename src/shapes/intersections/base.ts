import { Node } from '../../core/node';
import { AnchorPoint } from '../../type';

export abstract class IntersectionCalculator<TNode extends Node = Node> {
  protected EPS = 1e-9;
  protected abstract getIntersection(parentNode: TNode, childNode: TNode): AnchorPoint;

  protected _getCenterPoint(node: TNode): AnchorPoint {
    if (!node.position || !node.size) {
      throw new Error(`Node ${node.id} missing position or size`);
    }

    const { x, y } = node.position;

    switch (node.shape) {
      case 'rect':
      case 'diamond': {
        const { width, height } = node.size as { width: number; height: number };
        return { x: x + width / 2, y: y + height / 2 };
      }

      case 'circle': {
        const { radius } = node.size as { radius: number };
        return { x: x + radius, y: y + radius };
      }

      case 'ellipse': {
        const { rx, ry } = node.size as { rx: number; ry: number };
        return { x: x + rx, y: y + ry };
      }
      default:
        throw new Error(`Unsupported node shape: ${node.shape}`);
    }
  }
}
