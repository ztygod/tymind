// import type { Node } from '../core/node';
// import { AnchorPoint } from '../type';

// const EPS = 1e-9;

// /**
//  * BaseConnector is responsible for calculating the anchor points of connections between nodes.
//  * Can be extended to different styles (straight line, curve, polyline, etc.)
//  */
// export class BaseConnector {
//   /**
//    * Calculate the start and end coordinates of the line connecting the parent node and child node.
//    * Direction controls the connection direction (LR or RL)
//    */
//   public getEdgesEndPoints(
//     parentNode: Node,
//     childrenNode: Node,
//     direction: 'LR' | 'RL'
//   ): { sourcePoint: AnchorPoint; targetPoint: AnchorPoint } {
//     const sourcePoint = this.getLineRectangleIntersection(parentNode, childrenNode);

//     const targetPoint: AnchorPoint = {
//       x:
//         direction === 'LR'
//           ? childrenNode.position!.x
//           : childrenNode.position!.x + childrenNode.size!.width,
//       y: childrenNode.position!.y + childrenNode.size!.height / 2,
//     };

//     return { sourcePoint, targetPoint };
//   }

//   /**
//    * Calculate the intersection point of the line from parent to child with the parent's border
//    */
//   protected getLineRectangleIntersection(parent: Node, child: Node): AnchorPoint {
//     const { size: ps, position: pp } = parent;
//     const { size: cs, position: cp } = child;

//     const px = pp!.x,
//       py = pp!.y,
//       pw = ps!.width,
//       ph = ps!.height;
//     const cx = cp!.x,
//       cy = cp!.y,
//       cw = cs!.width,
//       ch = cs!.height;

//     // 中心点坐标
//     const x0 = px + pw / 2;
//     const y0 = py + ph / 2;
//     const x1 = cx + cw / 2;
//     const y1 = cy + ch / 2;

//     const dx = x1 - x0;
//     const dy = y1 - y0;

//     // 特殊情况：中心重合
//     if (Math.abs(dx) < EPS && Math.abs(dy) < EPS) {
//       return { x: x0, y: y0 };
//     }

//     const hits: { t: number; x: number; y: number }[] = [];

//     /** 如果交点在线段上，且在矩形边界内，则加入结果集 */
//     const pushIfValid = (t: number, ix: number, iy: number) => {
//       if (t > EPS && t <= 1 + EPS) {
//         const withinX = ix >= px - EPS && ix <= px + pw + EPS;
//         const withinY = iy >= py - EPS && iy <= py + ph + EPS;
//         if (withinX && withinY) hits.push({ t, x: ix, y: iy });
//       }
//     };

//     // === 检测与四条边的交点 ===

//     // Left edge: x = px
//     if (Math.abs(dx) > EPS) {
//       const t = (px - x0) / dx;
//       pushIfValid(t, px, y0 + t * dy);
//     }

//     // Right edge: x = px + pw
//     if (Math.abs(dx) > EPS) {
//       const t = (px + pw - x0) / dx;
//       pushIfValid(t, px + pw, y0 + t * dy);
//     }

//     // Top edge: y = py
//     if (Math.abs(dy) > EPS) {
//       const t = (py - y0) / dy;
//       pushIfValid(t, x0 + t * dx, py);
//     }

//     // Bottom edge: y = py + ph
//     if (Math.abs(dy) > EPS) {
//       const t = (py + ph - y0) / dy;
//       pushIfValid(t, x0 + t * dx, py + ph);
//     }

//     // === 返回结果 ===

//     if (hits.length === 0) {
//       // child 在 parent 内部（或数值退化）
//       return { x: x0, y: y0 };
//     }

//     // 按 t 排序，取最早相交的点
//     hits.sort((a, b) => {
//       if (Math.abs(a.t - b.t) > EPS) return a.t - b.t;
//       if (Math.abs(a.x - b.x) > EPS) return a.x - b.x;
//       return a.y - b.y;
//     });

//     return { x: hits[0].x, y: hits[0].y };
//   }
// }
