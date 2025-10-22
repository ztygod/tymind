import { Node } from '../../core/node';
import { AnchorPoint, RectNodeData } from '../../type';
import { IntersectionCalculator } from './base';

export class RectangleIntersections extends IntersectionCalculator<Node<RectNodeData>> {
  protected getIntersection(
    parentNode: Node<RectNodeData>,
    childNode: Node<RectNodeData>
  ): AnchorPoint {
    const parentCenter = this._getCenterPoint(parentNode);
    const childCenter = this._getCenterPoint(childNode);

    const dx = childCenter.x - parentCenter.x;
    const dy = childCenter.y - parentCenter.y;

    // Special case: coincident centers
    if (Math.abs(dx) < this.EPS && Math.abs(dy) < this.EPS) {
      return { x: parentCenter.x, y: parentCenter.y };
    }

    const hits: { t: number; x: number; y: number }[] = [];

    const pushIfValid = (t: number, ix: number, iy: number) => {
      if (!parentNode.position || !parentNode.size) return; // 提前返回
      if (t <= this.EPS || t > 1 + this.EPS) return;

      const withinX =
        ix >= parentNode.position.x - this.EPS &&
        ix <= parentNode.position.x + parentNode.size.width + this.EPS;
      const withinY =
        iy >= parentNode.position.y - this.EPS &&
        iy <= parentNode.position.y + parentNode.size.height + this.EPS;

      if (withinX && withinY) hits.push({ t, x: ix, y: iy });
    };

    const px = parentNode.position!.x;
    const py = parentNode.position!.y;
    const pw = parentNode.size!.width;
    const ph = parentNode.size!.height;

    // Left edge
    if (Math.abs(dx) > this.EPS) {
      const t = (px - parentCenter.x) / dx;
      pushIfValid(t, px, parentCenter.y + t * dy);
    }

    // Right edge
    if (Math.abs(dx) > this.EPS) {
      const t = (px + pw - parentCenter.x) / dx;
      pushIfValid(t, px + pw, parentCenter.y + t * dy);
    }

    // Top edge
    if (Math.abs(dy) > this.EPS) {
      const t = (py - parentCenter.y) / dy;
      pushIfValid(t, parentCenter.x + t * dx, py);
    }

    // Bottom edge
    if (Math.abs(dy) > this.EPS) {
      const t = (py + ph - parentCenter.y) / dy;
      pushIfValid(t, parentCenter.x + t * dx, py + ph);
    }

    if (hits.length === 0) {
      return parentCenter;
    }

    // 按 t 排序，取最先相交点
    hits.sort((a, b) => {
      if (Math.abs(a.t - b.t) > this.EPS) return a.t - b.t;
      if (Math.abs(a.x - b.x) > this.EPS) return a.x - b.x;
      return a.y - b.y;
    });

    return { x: hits[0].x, y: hits[0].y };
  }
}
