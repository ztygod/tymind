import type { AnchorPoint } from '../connector';
import { BaseRouter } from './base-router';

export class StraightRouter extends BaseRouter {
  getPathD(sourcePoint: AnchorPoint, targetPoint: AnchorPoint): string {
    return `M ${sourcePoint.x},${sourcePoint.y} L ${targetPoint.x},${targetPoint.y}`;
  }
}
