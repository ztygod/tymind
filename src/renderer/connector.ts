import type { Node } from '../core/node';
import { getIntersectionCalculator } from '../shapes/registry';
import {
  AnchorPoint,
  CircleNodeData,
  DiamondNodeData,
  EllipseNodeData,
  RectNodeData,
} from '../type';

/**
 * BaseConnector is responsible for calculating the anchor points of connections between nodes.
 * Can be extended to different styles (straight line, curve, polyline, etc.)
 */
export class BaseConnector {
  /**
   * Calculate the start and end coordinates of the line connecting the parent node and child node.
   * Direction controls the connection direction (LR or RL)
   */
  public getEdgesEndPoints(
    parentNode: Node,
    childrenNode: Node,
    direction: 'LR' | 'RL' | 'TB' | 'BT'
  ): { sourcePoint: AnchorPoint; targetPoint: AnchorPoint } {
    const sourceCalculator = getIntersectionCalculator(parentNode.shape!);
    const sourcePoint = sourceCalculator.getIntersection(parentNode as Node<any>, childrenNode);

    const { position, shape } = childrenNode;
    if (!position) throw new Error('childNode.position is missing');

    const calcX = (offset: number) => (direction === 'LR' ? position.x : position.x + offset);

    let targetPoint: AnchorPoint;

    switch (shape) {
      case 'rect':
      case 'diamond': {
        const { width, height } = (childrenNode as RectNodeData | DiamondNodeData).size!;
        targetPoint = {
          x: calcX(width),
          y: position.y + height / 2,
        };
        break;
      }
      case 'circle': {
        const { radius } = (childrenNode as CircleNodeData).size!;
        targetPoint = {
          x: calcX(radius),
          y: position.y + radius,
        };
        break;
      }
      case 'ellipse': {
        const { rx, ry } = (childrenNode as EllipseNodeData).size!;
        targetPoint = {
          x: calcX(rx),
          y: position.y + ry,
        };
        break;
      }
      default:
        throw new Error(`Unsupported shape: ${shape}`);
    }

    return { sourcePoint, targetPoint };
  }
}
