import type { AnchorPoint } from '../connector';
import { BaseRouter } from './base-router';

export class BezierRouter extends BaseRouter {
  getPathD(sourcePoint: AnchorPoint, targetPoint: AnchorPoint): string {
    const dx = Math.abs(targetPoint.x - sourcePoint.x);
    const cx1 = sourcePoint.x + dx * 0.4;
    const cx2 = targetPoint.x - dx * 0.4;
    const cy1 = sourcePoint.y;
    const cy2 = targetPoint.y;

    return `M ${sourcePoint.x},${sourcePoint.y} C ${cx1},${cy1} ${cx2},${cy2} ${targetPoint.x},${targetPoint.y}`;
  }
}
