import { Node } from '../core/node';
import { isCircle, isEllipse, isRectOrDiamond } from './typeUtils';

export function getNodeHeight(node: Node): number | undefined {
  const { size } = node;
  if (!size) return undefined;

  if (isRectOrDiamond(size)) return size.height; // 高度用 height
  if (isEllipse(size)) return size.ry * 2; // 椭圆高度 = 2 * ry
  if (isCircle(size)) return size.radius * 2; // 圆高度 = 直径

  return undefined;
}

export function getNodeWidth(node: Node): number | undefined {
  const { size } = node;
  if (!size) return undefined;

  if (isRectOrDiamond(size)) return size.width; // 宽度用 width
  if (isEllipse(size)) return size.rx * 2; // 椭圆宽度 = 2 * rx
  if (isCircle(size)) return size.radius * 2; // 圆宽度 = 直径

  return undefined;
}
