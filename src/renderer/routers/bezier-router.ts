import { AnchorPoint } from '../../type';
import { BaseRouter } from './base-router';

export class BezierRouter extends BaseRouter {
  getPathD(sourcePoint: AnchorPoint, targetPoint: AnchorPoint): string {
    const dx = targetPoint.x - sourcePoint.x;
    const dy = targetPoint.y - sourcePoint.y;

    // cubic-bezier(0.00, 0.00, 0.13, 1.00) 映射到控制点比例
    const p1x = 0.0,
      p1y = 0.0;
    const p2x = 0.13,
      p2y = 1.0;

    // 控制点实际坐标
    const cx1 = sourcePoint.x + dx * p1x;
    const cy1 = sourcePoint.y + dy * p1y;

    const cx2 = sourcePoint.x + dx * p2x;
    const cy2 = sourcePoint.y + dy * p2y;

    return `M ${sourcePoint.x},${sourcePoint.y} C ${cx1},${cy1} ${cx2},${cy2} ${targetPoint.x},${targetPoint.y}`;
  }
}
