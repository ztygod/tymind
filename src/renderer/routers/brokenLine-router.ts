import { AnchorPoint } from '../../type';
import { BaseRouter } from './base-router';

export class BrokenLine extends BaseRouter {
  getPathD(sourcePoint: AnchorPoint, targetPoint: AnchorPoint): string {
    return [
      `M ${sourcePoint.x},${sourcePoint.y}`,
      `L ${sourcePoint.x},${targetPoint.y}`,
      `L ${targetPoint.x},${targetPoint.y}`,
    ].join(' ');
  }
}
